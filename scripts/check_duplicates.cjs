const fs = require('fs');

// We can extract places directly by eval or parsing
const destDbFile = 'backend/src/services/destinationDatabase.ts';
const rawDest = fs.readFileSync(destDbFile, 'utf8');
const startArr = rawDest.indexOf('COMPREHENSIVE_INDIAN_DESTINATIONS: Place[] = [');
const objStart = rawDest.indexOf('[', startArr);
const objEnd = rawDest.lastIndexOf('];');

const places = eval(rawDest.slice(objStart, objEnd + 1));
console.log(`Loaded ${places.length} places from destinationDatabase.ts`);

const photoMap = new Map(); // photoUrl -> Array of { id, name, city, category }
places.forEach(p => {
  const photo = p.photos && p.photos[0];
  if (photo) {
    if (!photoMap.has(photo)) photoMap.set(photo, []);
    photoMap.get(photo).push({ id: p.id, name: p.name, city: p.city, category: p.category });
  }
});

let dupCount = 0;
for (const [url, list] of photoMap.entries()) {
  if (list.length > 1) {
    dupCount++;
    console.log(`\nDuplicate photo (${list.length} places): ${url}`);
    list.forEach(item => {
      console.log(`  - [${item.id}] "${item.name}" (${item.city}, category: ${item.category})`);
    });
  }
}

console.log(`\nTotal duplicate URL groups: ${dupCount}`);
