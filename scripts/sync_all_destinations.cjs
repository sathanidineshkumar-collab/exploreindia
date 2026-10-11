const fs = require('fs');
const path = require('path');

// 1. Read destinationDatabase.ts
const destDbFile = path.resolve(__dirname, '../backend/src/services/destinationDatabase.ts');
const rawDest = fs.readFileSync(destDbFile, 'utf8');
const startArr = rawDest.indexOf('COMPREHENSIVE_INDIAN_DESTINATIONS: Place[] = [');
const objStart = rawDest.indexOf('[', startArr);
const objEnd = rawDest.lastIndexOf('];');

let comprehensiveDestinations = [];
try {
  comprehensiveDestinations = eval(rawDest.slice(objStart, objEnd + 1));
  console.log(`Loaded ${comprehensiveDestinations.length} places from destinationDatabase.ts`);
} catch (e) {
  console.error("Failed to eval destinationDatabase.ts:", e.message);
}

// 2. Read curatedCatalog.ts
const curatedFile = path.resolve(__dirname, '../backend/src/services/curatedCatalog.ts');
const rawCurated = fs.readFileSync(curatedFile, 'utf8');

// Parse curated cities
let curatedPlaces = [];
const cStart = rawCurated.indexOf('export const CURATED_CITIES: Record<string, CuratedCityEntry> = {');
const cObjStart = rawCurated.indexOf('{', cStart);
const cObjEnd = rawCurated.lastIndexOf('};');

try {
  // Use regex to extract place objects or parse
  const matches = rawCurated.match(/\{[\s\n]*id:\s*"p-[^}]+city:[^}]+state:[^}]+\}/g);
  if (matches) {
    for (const m of matches) {
      try {
        const p = eval('(' + m + ')');
        curatedPlaces.push(p);
      } catch (err) {}
    }
  }
  console.log(`Loaded ${curatedPlaces.length} curated places from curatedCatalog.ts`);
} catch (e) {
  console.warn("Could not regex extract all curated places:", e.message);
}

// 3. Read existing data_store.json
const dbPath = path.resolve(__dirname, '../backend/data_store.json');
let existingDb = { places: [], cities: [] };
if (fs.existsSync(dbPath)) {
  existingDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Normalizer
function normalizeCategory(p) {
  if (p.category) return p.category.toLowerCase().trim();
  if (p.type === 'temple') return 'temple';
  if (p.type === 'hotel' || p.type === 'resort') return 'hotel';
  if (p.type === 'restaurant' || p.type === 'cafe') return 'restaurant';

  const subs = (p.subtypes || []).map(s => s.toLowerCase());
  if (subs.some(s => s.includes('fort') || s.includes('palace') || s.includes('monument') || s.includes('heritage'))) return 'heritage';
  if (subs.some(s => s.includes('beach') || s.includes('coast'))) return 'beach';
  if (subs.some(s => s.includes('waterfall') || s.includes('lake') || s.includes('river'))) return 'waterfall';
  if (subs.some(s => s.includes('wildlife') || s.includes('zoo') || s.includes('safari') || s.includes('national park'))) return 'wildlife';
  if (subs.some(s => s.includes('museum') || s.includes('gallery'))) return 'museum';
  if (subs.some(s => s.includes('market') || s.includes('bazaar') || s.includes('shopping'))) return 'market';
  if (subs.some(s => s.includes('garden') || s.includes('park'))) return 'garden';
  if (subs.some(s => s.includes('transit') || s.includes('airport') || s.includes('station'))) return 'transit';
  return 'attraction';
}

function isValidCoord(lat, lng) {
  return typeof lat === 'number' && typeof lng === 'number' && lat >= 6.5 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
}

// Merge & Deduplicate
const mergedMap = new Map(); // key: "city:name" -> place

// Priority 1: Comprehensive Destinations
for (const p of comprehensiveDestinations) {
  if (!isValidCoord(p.coordinates?.lat, p.coordinates?.lng)) continue;
  p.category = normalizeCategory(p);
  p.country = "India";
  const key = `${p.city.toLowerCase().trim()}:${p.name.toLowerCase().trim()}`;
  mergedMap.set(key, p);
}

// Priority 2: Curated Places from catalog
for (const p of curatedPlaces) {
  if (!isValidCoord(p.coordinates?.lat, p.coordinates?.lng)) continue;
  p.category = normalizeCategory(p);
  p.country = "India";
  const key = `${p.city.toLowerCase().trim()}:${p.name.toLowerCase().trim()}`;
  if (!mergedMap.has(key)) {
    mergedMap.set(key, p);
  }
}

// Priority 3: Existing places from db
for (const p of existingDb.places || []) {
  if (!isValidCoord(p.coordinates?.lat, p.coordinates?.lng)) continue;
  p.category = normalizeCategory(p);
  p.country = "India";
  const key = `${p.city.toLowerCase().trim()}:${p.name.toLowerCase().trim()}`;
  if (!mergedMap.has(key)) {
    mergedMap.set(key, p);
  }
}

function enrichPlaceMetadata(p) {
  if (!p.entryFee) {
    if (p.priceRange && p.priceRange.includes('entry')) {
      p.entryFee = p.priceRange;
    } else if (p.category === 'temple' || p.type === 'temple') {
      p.entryFee = 'Free entry / Darshan';
    } else if (p.category === 'hotel' || p.type === 'hotel' || p.category === 'restaurant' || p.type === 'restaurant') {
      p.entryFee = p.priceRange || 'No entry fee';
    } else if (p.category === 'beach') {
      p.entryFee = 'Free public access';
    } else if (p.category === 'heritage' || p.category === 'museum') {
      p.entryFee = p.priceRange || '₹50 (Indian Nationals) / ₹300 (Foreign Nationals)';
    } else if (p.category === 'wildlife') {
      p.entryFee = '₹250 safari & entry fee';
    } else if (p.category === 'waterfall' || p.category === 'nature') {
      p.entryFee = '₹30 eco-tourism entry fee';
    } else {
      p.entryFee = p.priceRange || 'Free public access';
    }
  }

  if (!p.bestTimeToVisit) {
    const northHimalayan = ['Jammu & Kashmir', 'Ladakh', 'Himachal Pradesh', 'Uttarakhand'];
    const coastal = ['Goa', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'Maharashtra'];
    if (northHimalayan.includes(p.state)) {
      p.bestTimeToVisit = (p.category === 'adventure' || p.name.includes('Pass')) ? 'May to October (Clear mountain roads)' : 'March to June & September to November';
    } else if (coastal.includes(p.state)) {
      p.bestTimeToVisit = 'October to March (Pleasant coastal breeze)';
    } else {
      p.bestTimeToVisit = 'October to March (Cool, pleasant weather)';
    }
  }

  if (!p.district) {
    p.district = p.city;
  }
  if (!p.region) {
    p.region = `${p.city}, ${p.state}`;
  }
}

const finalPlaces = Array.from(mergedMap.values());
for (const p of finalPlaces) {
  enrichPlaceMetadata(p);
}

// Statistics
const catCounts = {};
const cityCounts = {};
const stateCounts = {};

for (const p of finalPlaces) {
  catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
  stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
}

// Write to backend/data_store.json and root data_store.json
const targetFiles = [
  path.resolve(__dirname, '../backend/data_store.json'),
  path.resolve(__dirname, '../data_store.json')
];

for (const f of targetFiles) {
  if (!fs.existsSync(f)) continue;
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  data.places = finalPlaces;
  fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${f} with ${finalPlaces.length} total verified places.`);
}

// Sync cityImageCatalog.json
const catalogEntries = finalPlaces.map(p => ({
  city: p.city,
  place: p.name,
  category: p.category,
  image: p.photos && p.photos[0] ? p.photos[0] : ""
}));
const catPath = path.resolve(__dirname, '../backend/src/data/cityImageCatalog.json');
fs.writeFileSync(catPath, JSON.stringify(catalogEntries, null, 2), 'utf8');

console.log('\n========================================================');
console.log(`  SYNCHRONIZATION COMPLETE: ${finalPlaces.length} DESTINATIONS ACROSS INDIA`);
console.log('========================================================\n');
console.log('Breakdown by Category:');
console.table(catCounts);
console.log('\nTop Cities by Coverage:');
const sortedCities = Object.entries(cityCounts).sort((a,b) => b[1] - a[1]).slice(0, 15);
console.table(Object.fromEntries(sortedCities));
console.log('\nTop States by Coverage:');
const sortedStates = Object.entries(stateCounts).sort((a,b) => b[1] - a[1]).slice(0, 12);
console.table(Object.fromEntries(sortedStates));
