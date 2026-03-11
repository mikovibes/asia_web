import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = '/Users/miko/Development/websites/asia/food_picures';
const outputDir = '/Users/miko/Development/websites/asia/beo-an-web/public/food';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let counter = 1;
fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, `food_${counter}.avif`);
    
    sharp(inputPath)
      .avif({ quality: 65 })
      .toFile(outputPath)
      .then(() => console.log(`Converted ${file} to food_${counter}.avif`))
      .catch(err => console.error(err));
      
    counter++;
  }
});
