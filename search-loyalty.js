const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('isLoyaltyOpen') || line.includes('setIsLoyaltyOpen') || line.includes('LoyaltyModal') || line.includes('Club')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
