const fs = require('fs');
const path = require('path');

// Create a simple 1x1 pixel PNG placeholder (gray color)
// This is a valid PNG file encoded as base64
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const imgDir = path.join(__dirname, '..', 'public', 'img');
const filePath = path.join(imgDir, 'placeholder.png');

// Create directory if it doesn't exist
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Write placeholder images
const buffer = Buffer.from(pngBase64, 'base64');
fs.writeFileSync(filePath, buffer);
console.log('✅ Created placeholder.png');

// Create cover.jpg placeholder (gray background)
fs.writeFileSync(path.join(imgDir, 'cover.jpg'), buffer);
console.log('✅ Created cover.jpg');

// Create default.jpg placeholder
fs.writeFileSync(path.join(imgDir, 'default.jpg'), buffer);
console.log('✅ Created default.jpg');

// Create welcome-cover.jpg placeholder
fs.writeFileSync(path.join(imgDir, 'welcome-cover.jpg'), buffer);
console.log('✅ Created welcome-cover.jpg');

console.log('\n✅ Placeholder images created successfully!');
