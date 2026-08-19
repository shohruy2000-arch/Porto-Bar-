const sharp = require('sharp');
const path = require('path');

const LOGO_PATH = path.join(__dirname, 'public', 'images', 'porto-logo.jpg');
const MASKABLE_OUT_PATH = path.join(__dirname, 'public', 'images', 'porto-logo-maskable.png');

async function generateMaskable() {
  try {
    const logoMeta = await sharp(LOGO_PATH).metadata();
    const aspect = logoMeta.width / logoMeta.height;
    
    // Target 512x512 maskable size. Logo width is set to 380px to fit comfortably
    // within the 80% safe zone area.
    const logoWidth = 380;
    const logoHeight = Math.round(logoWidth / aspect);
    
    const resizedLogo = await sharp(LOGO_PATH)
      .resize(logoWidth, logoHeight)
      .toBuffer();

    // Composite logo centered on a #060a12 solid background
    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 6, g: 10, b: 18, alpha: 1 } // #060a12
      }
    })
    .composite([{
      input: resizedLogo,
      gravity: 'center'
    }])
    .png()
    .toFile(MASKABLE_OUT_PATH);

    console.log('Successfully generated maskable PWA icon!');
  } catch (error) {
    console.error('Failed to generate maskable icon:', error);
  }
}

generateMaskable();
