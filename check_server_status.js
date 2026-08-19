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
    console.log(`\n--- Running command: ${cmd} ---`);
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
  console.log('SSH connection established for diagnostics.');
  
  try {
    // 1. Check file size of deploy.zip
    await executeCommand(conn, 'ls -lh /root/deploy.zip || echo "Not found"');
    
    // 2. Check PM2 status
    await executeCommand(conn, 'pm2 status');

    conn.end();
  } catch (err) {
    console.error('Diagnostic command failed:', err);
    conn.end();
  }
}).on('error', (err) => {
  console.error('Connection error:', err);
});

conn.connect(config);
