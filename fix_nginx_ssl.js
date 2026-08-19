const { Client } = require('ssh2');

const config = {
  host: '192.124.181.134',
  port: 22,
  username: 'root',
  password: 'Rkab748bbbmRg'
};

const NEW_NGINX_CONFIG = `server {
    server_name porto-bar.ru www.porto-bar.ru;

    # Максимальный размер загружаемых файлов (для видео)
    client_max_body_size 100M;

    location /uploads/ {
        alias /var/www/porto-bar/public/uploads/;
        add_header Access-Control-Allow-Origin *;
        expires max;
    }

    location /videos/ {
        alias /var/www/porto-bar/public/videos/;
        add_header Access-Control-Allow-Origin *;
        expires max;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/porto-bar.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/porto-bar.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.porto-bar.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = porto-bar.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name porto-bar.ru www.porto-bar.ru;
    return 404; # managed by Certbot
}
`;

const conn = new Client();

function executeCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      let errOut = '';
      stream.on('data', (d) => out += d.toString());
      stream.stderr.on('data', (d) => errOut += d.toString());
      stream.on('close', (code) => {
        if (code !== 0) reject(new Error(`Exit code ${code}. Error: ${errOut}`));
        else resolve(out);
      });
    });
  });
}

conn.on('ready', async () => {
  console.log('SSH connected to update Nginx configuration.');
  try {
    const tempFile = '/tmp/porto-bar-nginx.conf';
    
    // SFTP upload config
    console.log('Uploading Nginx config...');
    await new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) return reject(err);
        const wStream = sftp.createWriteStream(tempFile);
        wStream.on('close', resolve);
        wStream.on('error', reject);
        wStream.write(NEW_NGINX_CONFIG);
        wStream.end();
      });
    });

    // Move to sites-available and overwrite
    await executeCommand(conn, `mv ${tempFile} /etc/nginx/sites-available/porto-bar`);
    console.log('Nginx config updated in sites-available.');

    // Validate Nginx config
    console.log('Validating Nginx config...');
    const validateRes = await executeCommand(conn, 'nginx -t');
    console.log(validateRes);

    // Restart Nginx
    console.log('Restarting Nginx...');
    await executeCommand(conn, 'systemctl restart nginx');
    console.log('Nginx restarted successfully with HTTP/2 enabled!');

    conn.end();
  } catch (error) {
    console.error('Failed to update Nginx config:', error);
    conn.end();
  }
}).on('error', (err) => console.error(err));

conn.connect(config);
