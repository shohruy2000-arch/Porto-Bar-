const { Client } = require('ssh2');

const config = {
  host: '192.124.181.134',
  port: 22,
  username: 'root',
  password: 'Rkab748bbbmRg'
};

const conn = new Client();

function executeCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n--- RUNNING: ${cmd} ---`);
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
  console.log('SSH connection successful. Reconfiguring VPN port...');
  try {
    // 1. Stop x-ui service
    console.log('Stopping x-ui VPN service...');
    await executeCommand(conn, 'systemctl stop x-ui || x-ui stop || killall xray || true');
    await executeCommand(conn, 'fuser -k 443/tcp || true');

    // 2. Backup config
    console.log('Backing up x-ui config...');
    await executeCommand(conn, 'cp /usr/local/x-ui/bin/config.json /usr/local/x-ui/bin/config.json.bak');

    // 3. Edit config to change port from 443 to 8443
    console.log('Changing port 443 to 8443 in config...');
    const editConfigCmd = `node -e "
      const fs = require('fs');
      const file = '/usr/local/x-ui/bin/config.json';
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      
      let modified = false;
      if (data.inbounds) {
        data.inbounds.forEach(inbound => {
          if (inbound.port === 443) {
            inbound.port = 8443;
            // Also update tag if it helps distinguish
            if (inbound.tag === 'in-9443-tcp') {
              inbound.tag = 'in-8443-tcp';
            }
            modified = true;
          }
        });
      }
      
      if (modified) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        console.log('Config successfully updated to port 8443!');
      } else {
        console.log('Could not find inbound with port 443 in config.');
      }
    "`;
    await executeCommand(conn, editConfigCmd);

    // 4. Start x-ui service
    console.log('Starting x-ui VPN service back up...');
    await executeCommand(conn, 'systemctl start x-ui || x-ui start || true');

    // 5. Restart Nginx to bind on port 443 securely
    console.log('Restarting Nginx on port 443...');
    await executeCommand(conn, 'systemctl restart nginx');
    await executeCommand(conn, 'systemctl enable nginx');

    // 6. Double check listening ports
    console.log('Verifying listening ports...');
    await executeCommand(conn, 'ss -tulpn | grep -E "443|8443" || lsof -i :443 || lsof -i :8443 || true');

    // 7. Verify services status
    await executeCommand(conn, 'systemctl status nginx | head -n 12');
    await executeCommand(conn, 'systemctl status x-ui | head -n 12 || true');

    console.log('\nVPN and Web server reconfiguration completed successfully!');
    conn.end();
  } catch (err) {
    console.error('Failed to reconfigure ports:', err);
    conn.end();
  }
}).on('error', (err) => {
  console.error('SSH Connection error:', err);
});

conn.connect(config);
