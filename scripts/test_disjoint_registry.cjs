const fs = require('fs');

const raw = fs.readFileSync('backend/src/services/imageService.ts', 'utf8');

// Parse CITY_LANDMARK_REGISTRY
const regStart = raw.indexOf('export const CITY_LANDMARK_REGISTRY: Record<');
const objStart = raw.indexOf('{\n  hyderabad: {', regStart);
const objEnd = raw.indexOf('};\n\n/**', objStart);

if (objStart === -1 || objEnd === -1) {
  console.error('Could not find CITY_LANDMARK_REGISTRY in imageService.ts');
  process.exit(1);
}

const registry = eval('(' + raw.slice(objStart, objEnd + 1) + ')');
const citySets = {};

for (const [city, data] of Object.entries(registry)) {
  const set = new Set();
  const allUrls = [
    data.hero,
    ...Object.values(data.landmarks || {}).flat(),
    ...(data.food || []),
    ...(data.stays || []),
    ...(data.culture || [])
  ];
  for (const u of allUrls) {
    const m = u.match(/photo-[^?]+/);
    if (m) set.add(m[0]);
  }
  citySets[city] = set;
}

let collisions = 0;
const cities = Object.keys(citySets);
for (let i = 0; i < cities.length; i++) {
  for (let j = i + 1; j < cities.length; j++) {
    const c1 = cities[i], c2 = cities[j];
    for (const pid of citySets[c1]) {
      if (citySets[c2].has(pid)) {
        console.error(`COLLISION between ${c1} and ${c2} on ${pid}`);
        collisions++;
      }
    }
  }
}

if (collisions === 0) {
  console.log(`SUCCESS: Exactly ZERO cross-city collisions across all ${cities.length} cities!`);
  for (const [c, s] of Object.entries(citySets)) {
    console.log(`  - ${c.padEnd(12)}: ${s.size} unique photos`);
  }
} else {
  console.error(`FAILED: Found ${collisions} cross-city collisions`);
  process.exit(1);
}
