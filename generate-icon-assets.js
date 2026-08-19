const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT_ICON = path.join(__dirname, 'public', 'images', 'Porto icon.png');
const OUT_DIR = path.join(__dirname, 'public', 'images');

async function processIcons() {
  console.log('Processing new app icon assets...');
  try {
    if (!fs.existsSync(INPUT_ICON)) {
      throw new Error(`Input icon not found at: ${INPUT_ICON}`);
    }

    // 1. Generate 192x192 app icon
    await sharp(INPUT_ICON)
      .resize(192, 192)
      .png()
      .toFile(path.join(OUT_DIR, 'porto-app-icon-192.png'));
    console.log('Generated: porto-app-icon-192.png');

    // 2. Generate 512x512 app icon
    await sharp(INPUT_ICON)
      .resize(512, 512)
      .png()
      .toFile(path.join(OUT_DIR, 'porto-app-icon-512.png'));
    console.log('Generated: porto-app-icon-512.png');

    // 3. Generate 512x512 maskable app icon
    // We scale the logo to 410px (80% of 512px) to ensure no core content is cut off on Android devices
    const logoResized = await sharp(INPUT_ICON)
      .resize(410, 410)
      .toBuffer();

    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 6, g: 10, b: 18, alpha: 1 } // #060a12 (brand color)
      }
    })
    .composite([{
      input: logoResized,
      gravity: 'center'
    }])
    .png()
    .toFile(path.join(OUT_DIR, 'porto-app-icon-maskable.png'));
    console.log('Generated: porto-app-icon-maskable.png');

    console.log('Icon processing completed successfully!');
  } catch (error) {
    console.error('Error processing icons:', error);
  }
}

processIcons();
