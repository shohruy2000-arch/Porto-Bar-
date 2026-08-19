const fs = require('fs');
const path = require('path');

const dbDir = path.join(process.cwd(), 'src', 'data', 'db');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function migrateBase64Image(imageStr, index, prefix) {
  if (!imageStr || !imageStr.startsWith('data:')) return imageStr;

  try {
    const matches = imageStr.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
    if (!matches) return imageStr;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';

    const filename = `migrated_${prefix}_${Date.now()}_${index}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);
    console.log(`Migrated base64 image: ${filename}`);

    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to migrate base64 image:', err);
    return imageStr;
  }
}

function migrateDb() {
  ensureDirExists(uploadsDir);
  ensureDirExists(dbDir);

  // 1. Migrate Dishes
  const dishesPath = path.join(dbDir, 'dishes.json');
  if (fs.existsSync(dishesPath)) {
    console.log('Checking dishes.json for base64 images...');
    const raw = fs.readFileSync(dishesPath, 'utf8');
    const dishes = JSON.parse(raw);
    let modified = false;

    dishes.forEach((dish, idx) => {
      if (dish.image && dish.image.startsWith('data:')) {
        dish.image = migrateBase64Image(dish.image, idx, 'dish');
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(dishesPath, JSON.stringify(dishes, null, 2), 'utf8');
      console.log('Saved migrated dishes.json!');
    } else {
      console.log('No base64 images found in dishes.json.');
    }
  }

  // 2. Migrate Promotions
  const promosPath = path.join(dbDir, 'promotions.json');
  if (fs.existsSync(promosPath)) {
    console.log('Checking promotions.json for base64 images...');
    const raw = fs.readFileSync(promosPath, 'utf8');
    const promos = JSON.parse(raw);
    let modified = false;

    promos.forEach((promo, idx) => {
      if (promo.image && promo.image.startsWith('data:')) {
        promo.image = migrateBase64Image(promo.image, idx, 'promo');
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(promosPath, JSON.stringify(promos, null, 2), 'utf8');
      console.log('Saved migrated promotions.json!');
    } else {
      console.log('No base64 images found in promotions.json.');
    }
  }
  
  console.log('Migration completed successfully!');
}

migrateDb();
