const fs = require('fs');
const path = require('path');

function checkFilePhotos(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const urls = content.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-_?=.]+/g) || [];
  console.log(`\n--- Auditing: ${filePath} ---`);
  console.log(`Total Unsplash URLs found: ${urls.length}`);
  const uniqueUrls = new Set(urls);
  console.log(`Unique URLs: ${uniqueUrls.size}`);
  
  const freq = {};
  urls.forEach(u => freq[u] = (freq[u] || 0) + 1);
  const dups = Object.entries(freq).filter(([_, c]) => c > 1);
  if (dups.length > 0) {
    console.log(`Duplicate URLs within this file: ${dups.length}`);
    dups.slice(0, 10).forEach(([u, c]) => console.log(`  [${c}x] ${u}`));
  } else {
    console.log(`✓ 0 duplicate URLs within this file!`);
  }
}

checkFilePhotos('backend/src/services/destinationDatabase.ts');
checkFilePhotos('backend/src/services/imageService.ts');
checkFilePhotos('backend/src/services/curatedCatalog.ts');
checkFilePhotos('data_store.json');
