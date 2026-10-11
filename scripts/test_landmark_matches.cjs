const fs = require('fs');

// Test matching of all curated places against landmark registry
const curatedCatalogRaw = fs.readFileSync('backend/src/services/curatedCatalog.ts', 'utf8');
const imageServiceRaw = fs.readFileSync('backend/src/services/imageService.ts', 'utf8');

// Extract place names and cities from curatedCatalog
const placeMatches = [...curatedCatalogRaw.matchAll(/name:\s*"([^"]+)"[\s\S]*?city:\s*"([^"]+)"/g)];
console.log(`Found ${placeMatches.length} curated places to test.`);

// Helper function to test matching
function matchesLandmark(placeName, landmarkKey) {
  const p = placeName.toLowerCase();
  const l = landmarkKey.toLowerCase();
  if (p.includes(l) || l.includes(p)) return true;
  // If all significant words in landmarkKey are in placeName (e.g. "san thome basilica" in "san thome cathedral basilica")
  const lWords = l.split(/\s+/).filter(w => w.length > 2);
  const matchedWords = lWords.filter(w => p.includes(w));
  return matchedWords.length >= 2;
}

for (const m of placeMatches) {
  const placeName = m[1];
  const city = m[2];
  console.log(`Testing: [${city}] "${placeName}"`);
}
