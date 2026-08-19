const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const projectDir = __dirname;
const outputZip = path.join(projectDir, 'deploy.zip');

const excludes = [
  'node_modules',
  '.next',
  '.git',
  '.gitignore',
  'README.md',
  'deploy.zip',
  'package-lock.json'
];

function addDirectoryToZip(zip, dirPath, zipPath = '') {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (excludes.includes(item)) continue;
    
    const fullPath = path.join(dirPath, item);
    const relPath = zipPath ? path.join(zipPath, item) : item;
    
    // Convert Windows backslashes to forward slashes for ZIP compatibility
    const zipEntryName = relPath.replace(/\\/g, '/');
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectoryToZip(zip, fullPath, relPath);
    } else {
      const fileData = fs.readFileSync(fullPath);
      zip.file(zipEntryName, fileData);
    }
  }
}

async function createZip() {
  console.log('Zipping project contents...');
  const zip = new JSZip();
  addDirectoryToZip(zip, projectDir);
  
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
  fs.writeFileSync(outputZip, content);
  console.log(`Successfully created zip: ${outputZip} (${(content.length / 1024 / 1024).toFixed(2)} MB)`);
}

createZip().catch(err => {
  console.error('Failed to create zip:', err);
  process.exit(1);
});
