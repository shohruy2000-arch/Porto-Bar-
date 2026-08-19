const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGO_PATH = path.join(__dirname, 'public', 'images', 'porto-logo.jpg');
const OUT_DIR = path.join(__dirname, 'public', 'splash');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Define resolutions for modern iPhones:
// name: output filename
// width, height: physical screen resolution
const SPLASH_SIZES = [
  { name: 'apple-splash-1290-2796.png', width: 1290, height: 2796 }, // iPhone 14/15/16 Pro Max
  { name: 'apple-splash-1179-2556.png', width: 1179, height: 2556 }, // iPhone 14/15/16 Pro
  { name: 'apple-splash-1284-2778.png', width: 1284, height: 2778 }, // iPhone 13 Pro Max, 14 Plus
  { name: 'apple-splash-1170-2532.png', width: 1170, height: 2532 }, // iPhone 12/12 Pro, 13/13 Pro, 14, 15, 16
  { name: 'apple-splash-1125-2436.png', width: 1125, height: 2436 }, // iPhone X/XS/11 Pro, 12/13 Mini
  { name: 'apple-splash-828-1792.png', width: 828, height: 1792 },   // iPhone XR, 11
  { name: 'apple-splash-750-1334.png', width: 750, height: 1334 }    // iPhone SE (2nd/3rd Gen), 8, 7, 6s
];

async function generateSplashes() {
  console.log('Starting iOS Splash Screen generation...');
  try {
    // Read the logo metadata to get its aspect ratio
    const logoMeta = await sharp(LOGO_PATH).metadata();
    const logoAspect = logoMeta.width / logoMeta.height;

    for (const size of SPLASH_SIZES) {
      const targetPath = path.join(OUT_DIR, size.name);
      
      // Calculate dynamic logo width: 25% of screen width, bounded between 160 and 320 px
      let logoWidth = Math.round(size.width * 0.25);
      if (logoWidth < 180) logoWidth = 180;
      if (logoWidth > 320) logoWidth = 320;
      
      const logoHeight = Math.round(logoWidth / logoAspect);

      // Resize logo
      const resizedLogo = await sharp(LOGO_PATH)
        .resize(logoWidth, logoHeight)
        .toBuffer();

      // Create solid Porto Bar background
      await sharp({
        create: {
          width: size.width,
          height: size.height,
          channels: 4,
          background: { r: 6, g: 10, b: 18, alpha: 1 } // #060a12
        }
      })
      .composite([{
        input: resizedLogo,
        gravity: 'center'
      }])
      .png()
      .toFile(targetPath);

      console.log(`Generated: ${size.name} (${size.width}x${size.height})`);
    }
    console.log('All splash screens generated successfully!');
  } catch (error) {
    console.error('Error generating splash screens:', error);
  }
}

generateSplashes();
