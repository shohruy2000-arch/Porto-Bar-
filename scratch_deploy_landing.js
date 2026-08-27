const { Client } = require('ssh2');

const config = {
  host: '192.124.181.134',
  port: 22,
  username: 'root',
  password: 'Rkab748bbbmRg',
  readyTimeout: 60000
};

const conn = new Client();

function executeCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n>>> Executing: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', (code, signal) => {
        resolve({ code, stdout, stderr });
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

conn.on('ready', async () => {
  console.log('SSH connection established successfully.');
  try {
    const appDir = '/var/www/porto-bar';

    console.log('Step 1: Pulling latest commits from GitHub...');
    await executeCommand(conn, `cd ${appDir} && git fetch origin && git reset --hard origin/main`);

    console.log('Step 2: Building Next.js app on server...');
    await executeCommand(conn, `cd ${appDir} && npm run build`);

    console.log('Step 3: Restarting PM2 process...');
    await executeCommand(conn, `pm2 restart porto-bar`);
    await executeCommand(conn, 'pm2 save');
    await executeCommand(conn, 'pm2 list');

    console.log('\n Landing & Super-admin routes are live on server!');
    conn.end();
  } catch (err) {
    console.error('Server deployment failed:', err);
    conn.end();
  }
}).on('error', (err) => {
  console.error('SSH connection error:', err);
});

conn.connect(config);
