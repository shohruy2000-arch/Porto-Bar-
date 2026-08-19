const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const config = {
  host: '192.124.181.134',
  port: 22,
  username: 'root',
  password: 'Rkab748bbbmRg',
  readyTimeout: 60000
};

const conn = new Client();

const localZipPath = path.join(__dirname, 'deploy.zip');
const remoteZipPath = '/root/deploy.zip';
const remoteAppDir = '/var/www/porto-bar';

function executeCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`Executing remote command: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      
      let stdout = '';
      let stderr = '';
      
      stream.on('close', (code, signal) => {
        console.log(`Command closed with code ${code}`);
        if (code !== 0) {
          reject(new Error(`Command failed with code ${code}\nStderr: ${stderr}`));
        } else {
          resolve(stdout);
        }
      }).on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data.toString());
      });
    });
  });
}

function uploadFile(conn, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    console.log(`Uploading file via SFTP: ${localPath} -> ${remotePath}`);
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      
      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      
      writeStream.on('close', () => {
        console.log('File upload completed successfully.');
        resolve();
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
      
      readStream.pipe(writeStream);
    });
  });
}

conn.on('ready', async () => {
  console.log('SSH connection established successfully.');
  
  try {
    // 1. Prepare environment on the remote server
    console.log('Step 1: Preparing server dependencies (curl, unzip, Node.js, PM2)...');
    
    // Check if Node is installed, install Node 20 if missing
    await executeCommand(conn, 'which node || (curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs)');
    await executeCommand(conn, 'which unzip || apt-get install -y unzip');
    await executeCommand(conn, 'node -v && npm -v');
    
    // Install PM2 globally
    await executeCommand(conn, 'which pm2 || npm install -g pm2');

    // 2. Upload zip package
    console.log('Step 2: Uploading build package...');
    await uploadFile(conn, localZipPath, remoteZipPath);

    // 3. Extract and build
    console.log('Step 3: Extracting files and building project...');
    await executeCommand(conn, `mkdir -p ${remoteAppDir}`);
    await executeCommand(conn, `unzip -o ${remoteZipPath} -d ${remoteAppDir} -x "*config.json" "*categories.json" "*dishes.json" "*loyalty.json" "*orders.json" "*promotions.json" "*waiter_calls.json" "*waiter-calls.json" || [ $? -eq 1 ]`);
    
    console.log('Installing dependencies on remote server...');
    await executeCommand(conn, `cd ${remoteAppDir} && npm install`);

    console.log('Running database image migrations on server...');
    await executeCommand(conn, `cd ${remoteAppDir} && node migrate_db_images.js && rm -f migrate_db_images.js`);
    
    console.log('Building production Next.js app...');
    await executeCommand(conn, `cd ${remoteAppDir} && npm run build`);

    // 4. Configure Firewall to open port 3000
    console.log('Step 4: Ensuring port 3000 is open...');
    await executeCommand(conn, 'ufw allow 3000/tcp || iptables -A INPUT -p tcp --dport 3000 -j ACCEPT || true');

    // 5. Start/Restart application with PM2
    console.log('Step 5: Starting application under PM2...');
    await executeCommand(conn, `cd ${remoteAppDir} && pm2 delete porto-bar || true`);
    await executeCommand(conn, `cd ${remoteAppDir} && pm2 start npm --name "porto-bar" -- run start`);
    await executeCommand(conn, 'pm2 save');
    await executeCommand(conn, 'pm2 list');

    console.log('Deployment completed successfully! Porto Bar is live on port 3000.');
    conn.end();
  } catch (err) {
    console.error('Deployment failed:', err);
    conn.end();
    process.exit(1);
  }
}).on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
});

conn.connect(config);
