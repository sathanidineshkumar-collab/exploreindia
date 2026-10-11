const fs = require('fs');

const raw = fs.readFileSync('backend/src/services/imageService.ts', 'utf8');
const photoMatches = [...raw.matchAll(/photo-[a-zA-Z0-9-]+/g)].map(m => m[0]);
const uniquePhotos = new Set(photoMatches);
console.log('Total photo references in imageService.ts:', photoMatches.length);
console.log('Unique photos in imageService.ts:', uniquePhotos.size);

// Check duplicate occurrences in imageService.ts
const counts = {};
for (const p of photoMatches) {
  counts[p] = (counts[p] || 0) + 1;
}
const dups = Object.entries(counts).filter(([_, c]) => c > 1);
console.log('Duplicate photo occurrences in imageService.ts:');
for (const [p, c] of dups) {
  console.log(`  ${p}: ${c} times`);
}
