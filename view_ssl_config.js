const { Client } = require('ssh2');

const config = {
  host: '192.124.181.134',
  port: 22,
  username: 'root',
  password: 'Rkab748bbbmRg'
};

const conn = new Client();

conn.on('ready', () => {
  conn.exec('cat /etc/nginx/options-ssl-nginx.conf', (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', (d) => out += d.toString());
    stream.on('close', () => {
      console.log('--- Content of /etc/nginx/options-ssl-nginx.conf ---');
      console.log(out);
      conn.end();
    });
  });
}).on('error', (err) => console.error(err));

conn.connect(config);
