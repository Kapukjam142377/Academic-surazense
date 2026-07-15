const fs = require('fs');
const path = require('path');

function getJpgSize(buffer) {
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xFF) {
        break;
      }
      const marker = buffer[offset + 1];
      if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2 || marker === 0xC3) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height };
      } else {
        const length = buffer.readUInt16BE(offset + 2);
        offset += length + 2;
      }
    }
  }
  return null;
}

for (let i = 1; i <= 6; i++) {
  const file = `Award${i}.jpg`;
  const filepath = path.join('public', file);
  try {
    const buffer = fs.readFileSync(filepath);
    const size = getJpgSize(buffer);
    if (size) {
      console.log(`${file}: ${size.width}x${size.height} (ratio ${(size.width / size.height).toFixed(2)})`);
    }
  } catch (e) {
    console.log(`Failed to read ${file}: ${e.message}`);
  }
}
