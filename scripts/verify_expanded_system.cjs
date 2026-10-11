const assert = require('assert');

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';

function assertRealPhoto(url, contextMsg) {
  assert(url && typeof url === 'string', `${contextMsg}: Image must be a non-empty string`);
  assert(!url.startsWith('data:image/svg'), `${contextMsg}: Image must NOT be an SVG placeholder (${url.slice(0, 30)})`);
  assert(url.startsWith('https://'), `${contextMsg}: Image must be an HTTPS real photo URL`);
  assert(url.includes('images.unsplash.com') || url.includes('wikimedia') || url.includes('photo-'), `${contextMsg}: Image must be a photographic asset`);
}

async function runComprehensiveExpansionAudit() {
  console.log('================================================================');
  console.log('    EXPLOREINDIA EXPANDED TRAVEL DISCOVERY SYSTEM AUDIT        ');
  console.log('================================================================\n');

  // -------------------------------------------------------------------
  // 1. DATABASE INVENTORY & CATEGORY STATS
  // -------------------------------------------------------------------
  console.log('>>> [1] AUDITING DATABASE INVENTORY & CATEGORY COUNTS <<<');
  const catRes = await fetch(`${BACKEND_URL}/api/places/categories`);
  assert.strictEqual(catRes.status, 200, 'GET /api/places/categories must return 200');
  const catStats = await catRes.json();
  
  assert(catStats.all >= 300, `Database must contain >= 300 destinations (found: ${catStats.all})`);

  console.log(`  ✓ Total Verified Destinations: ${catStats.all}`);
  console.log('  ✓ Category Distribution:');
  for (const [cat, count] of Object.entries(catStats)) {
    if (cat !== 'all') {
      console.log(`     - ${cat.padEnd(16)}: ${count} places`);
    }
  }

  // -------------------------------------------------------------------
  // 2. INDIA-WIDE REGIONAL SPREAD (NORTH, SOUTH, EAST, WEST, CENTRAL, NE, HIMALAYAS)
  // -------------------------------------------------------------------
  console.log('\n>>> [2] AUDITING REGIONAL SPREAD ACROSS INDIA <<<');
  const representativeCities = [
    { name: 'Hyderabad', state: 'Telangana', region: 'South' },
    { name: 'Chennai', state: 'Tamil Nadu', region: 'South' },
    { name: 'Bangalore', state: 'Karnataka', region: 'South' },
    { name: 'Kochi', state: 'Kerala', region: 'South' },
    { name: 'Mumbai', state: 'Maharashtra', region: 'West' },
    { name: 'Goa', state: 'Goa', region: 'West' },
    { name: 'Ahmedabad', state: 'Gujarat', region: 'West' },
    { name: 'Delhi', state: 'Delhi', region: 'North' },
    { name: 'Jaipur', state: 'Rajasthan', region: 'North' },
    { name: 'Amritsar', state: 'Punjab', region: 'North' },
    { name: 'Varanasi', state: 'Uttar Pradesh', region: 'North' },
    { name: 'Agra', state: 'Uttar Pradesh', region: 'North' },
    { name: 'Kolkata', state: 'West Bengal', region: 'East' },
    { name: 'Puri', state: 'Odisha', region: 'East' },
    { name: 'Shimla', state: 'Himachal Pradesh', region: 'Himalayan' },
    { name: 'Rishikesh', state: 'Uttarakhand', region: 'Himalayan' },
    { name: 'Srinagar', state: 'Jammu & Kashmir', region: 'Himalayan' },
    { name: 'Leh', state: 'Ladakh', region: 'Himalayan' },
    { name: 'Guwahati', state: 'Assam', region: 'Northeast' },
    { name: 'Shillong', state: 'Meghalaya', region: 'Northeast' }
  ];

  const cityCardMap = new Map();
  for (const c of representativeCities) {
    const res = await fetch(`${BACKEND_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: c.name, limit: 30 })
    });
    assert.strictEqual(res.status, 200, `City discovery failed for ${c.name}`);
    const data = await res.json();
    assert(data.city, `City metadata missing for ${c.name}`);
    assert(data.places && data.places.length > 0, `No places found for ${c.name}`);
    assertRealPhoto(data.city.image, `${c.name} hero`);

    // Verify coordinates
    assert(data.city.lat >= 8 && data.city.lat <= 36, `Valid India lat for ${c.name}`);
    assert(data.city.lng >= 68 && data.city.lng <= 98, `Valid India lng for ${c.name}`);

    // Check categories in response
    assert(data.categoryCounts, `categoryCounts missing for ${c.name}`);
    
    cityCardMap.set(c.name, data);
    console.log(`  ✓ [${c.region.padEnd(9)}] ${c.name.padEnd(12)} (${c.state}): ${data.total} total places (Hero: ${data.city.image.slice(0, 50)}...)`);
  }

  // -------------------------------------------------------------------
  // 3. PAGINATION & "LOAD MORE" VERIFICATION
  // -------------------------------------------------------------------
  console.log('\n>>> [3] AUDITING PAGINATION & LOAD MORE (PAGE 1 vs PAGE 2) <<<');
  const page1Res = await fetch(`${BACKEND_URL}/api/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Hyderabad', page: 1, limit: 12 })
  });
  const page1 = await page1Res.json();
  assert.strictEqual(page1.page, 1);
  assert.strictEqual(page1.limit, 12);
  assert.strictEqual(page1.places.length, 12);
  assert(page1.totalPages >= 2, `Total pages must be >= 2 for Hyderabad (totalPages: ${page1.totalPages})`);

  const page2Res = await fetch(`${BACKEND_URL}/api/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Hyderabad', page: 2, limit: 12 })
  });
  const page2 = await page2Res.json();
  assert.strictEqual(page2.page, 2);
  assert(page2.places.length > 0 && page2.places.length <= 12, `Page 2 must contain remaining items up to limit`);

  // Check no duplicates between page 1 and page 2
  const page1Ids = new Set(page1.places.map(p => p.id));
  const overlap = page2.places.filter(p => page1Ids.has(p.id));
  assert.strictEqual(overlap.length, 0, `Pagination pages 1 and 2 must not have overlapping places (found ${overlap.length})`);
  console.log(`  ✓ Page 1: ${page1.places.length} items, Page 2: ${page2.places.length} items. Zero duplicates across pages.`);
  console.log(`  ✓ Total Hyderabad records: ${page1.total}, Total Pages: ${page1.totalPages}`);

  // -------------------------------------------------------------------
  // 4. NATURAL SEARCH INTENT ENGINE
  // -------------------------------------------------------------------
  console.log('\n>>> [4] AUDITING NATURAL SEARCH INTENT QUERIES <<<');
  const naturalQueries = [
    { query: 'temples in Varanasi', expectedCat: 'temple', expectedCity: 'Varanasi', expectedName: 'kashi' },
    { query: 'forts in Rajasthan', expectedCat: 'heritage', expectedState: 'Rajasthan' },
    { query: 'waterfalls in Kerala', expectedCat: 'waterfall', expectedState: 'Kerala', expectedName: 'athirappilly' },
    { query: 'beaches in Goa', expectedCat: 'beach', expectedCity: 'Goa', expectedName: 'calangute' },
    { query: 'biryani in Hyderabad', expectedCat: 'restaurant', expectedCity: 'Hyderabad', expectedName: 'bawarchi' },
    { query: 'luxury hotels in Delhi', expectedCat: 'hotel', expectedCity: 'Delhi' },
    { query: 'monuments in Agra', expectedCat: 'heritage', expectedCity: 'Agra', expectedName: 'taj mahal' }
  ];

  for (const q of naturalQueries) {
    const res = await fetch(`${BACKEND_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q.query })
    });
    assert.strictEqual(res.status, 200, `Natural search failed for "${q.query}"`);
    const data = await res.json();
    assert(data.places.length > 0, `Natural search for "${q.query}" returned 0 places`);

    if (q.expectedCity) {
      assert(data.city.name.toLowerCase().includes(q.expectedCity.toLowerCase()), 
        `Expected city ${q.expectedCity} for "${q.query}", got ${data.city.name}`);
    }
    if (q.expectedName) {
      const match = data.places.some(p => p.name.toLowerCase().includes(q.expectedName.toLowerCase()));
      assert(match, `Expected place containing "${q.expectedName}" in "${q.query}"`);
    }

    console.log(`  ✓ Query: "${q.query}" -> City: ${data.city.name}, Found: ${data.places.length} places (Top: "${data.places[0].name}")`);
  }

  // -------------------------------------------------------------------
  // 5. SORTING & ORDERING VALIDATION
  // -------------------------------------------------------------------
  console.log('\n>>> [5] AUDITING SERVER-SIDE SORTING ENGINE <<<');
  const sortModes = [
    { sortBy: 'rating', check: (places) => {
      for (let i = 0; i < places.length - 1; i++) {
        assert(places[i].rating >= places[i+1].rating, `Rating sort failed: ${places[i].rating} < ${places[i+1].rating}`);
      }
    }},
    { sortBy: 'reviews', check: (places) => {
      for (let i = 0; i < places.length - 1; i++) {
        assert(places[i].reviewCount >= places[i+1].reviewCount, `Review sort failed: ${places[i].reviewCount} < ${places[i+1].reviewCount}`);
      }
    }},
    { sortBy: 'price_asc', check: (places) => {
      for (let i = 0; i < places.length - 1; i++) {
        assert(places[i].priceLevel <= places[i+1].priceLevel, `Price asc sort failed: ${places[i].priceLevel} > ${places[i+1].priceLevel}`);
      }
    }},
    { sortBy: 'price_desc', check: (places) => {
      for (let i = 0; i < places.length - 1; i++) {
        assert(places[i].priceLevel >= places[i+1].priceLevel, `Price desc sort failed: ${places[i].priceLevel} < ${places[i+1].priceLevel}`);
      }
    }}
  ];

  for (const s of sortModes) {
    const res = await fetch(`${BACKEND_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Delhi', sortBy: s.sortBy, limit: 10 })
    });
    const data = await res.json();
    s.check(data.places);
    console.log(`  ✓ Sort by '${s.sortBy}' verified on ${data.places.length} places in Delhi`);
  }

  // -------------------------------------------------------------------
  // 6. PHOTO AUTHENTICITY & ZERO CROSS-CITY COLLISION
  // -------------------------------------------------------------------
  console.log('\n>>> [6] AUDITING PHOTO AUTHENTICITY & ZERO CROSS-CITY COLLISION <<<');
  const globalPhotoMap = new Map();
  let totalPhotosChecked = 0;

  for (const [cityName, data] of cityCardMap.entries()) {
    for (const place of data.places) {
      assert(place.photos && place.photos.length > 0, `Place ${place.name} has no photos`);
      for (const photo of place.photos) {
        assertRealPhoto(photo, `${cityName} - ${place.name}`);
        totalPhotosChecked++;

        if (!globalPhotoMap.has(photo)) {
          globalPhotoMap.set(photo, new Set());
        }
        globalPhotoMap.get(photo).add(cityName);
      }
    }
  }

  let crossCityCollisions = 0;
  for (const [photo, cities] of globalPhotoMap.entries()) {
    if (cities.size > 1) {
      crossCityCollisions++;
      console.warn(`  Warning: photo shared across cities [${Array.from(cities).join(', ')}]: ${photo.slice(0, 60)}`);
    }
  }

  assert.strictEqual(crossCityCollisions, 0, `Found ${crossCityCollisions} photos shared across different cities!`);
  console.log(`  ✓ Total photos inspected: ${totalPhotosChecked}`);
  console.log(`  ✓ Distinct photographic assets: ${globalPhotoMap.size}`);
  console.log(`  ✓ ZERO SVG placeholders found`);
  console.log(`  ✓ ZERO cross-city photo sharing detected across all ${cityCardMap.size} cities`);

  // -------------------------------------------------------------------
  // 7. RICH METADATA FIELDS (ENTRY FEE, BEST TIME, TIMINGS, DISTRICT)
  // -------------------------------------------------------------------
  console.log('\n>>> [7] AUDITING RICH METADATA FIELDS <<<');
  const sampleVaranasi = cityCardMap.get('Varanasi').places.find(p => p.name.toLowerCase().includes('kashi vishwanath'));
  assert(sampleVaranasi, 'Kashi Vishwanath must exist');
  assert(sampleVaranasi.category, 'Place must have category');
  assert(sampleVaranasi.bestTimeToVisit, 'Place must have bestTimeToVisit');
  assert(sampleVaranasi.entryFee, 'Place must have entryFee');
  console.log(`  ✓ Kashi Vishwanath metadata:`);
  console.log(`     - Category: ${sampleVaranasi.category}`);
  console.log(`     - Entry Fee: ${sampleVaranasi.entryFee}`);
  console.log(`     - Best Time: ${sampleVaranasi.bestTimeToVisit}`);
  console.log(`     - Coordinates: [${sampleVaranasi.coordinates.lat}, ${sampleVaranasi.coordinates.lng}]`);

  console.log('\n================================================================');
  console.log('   ALL EXPANSION AUDIT CHECKS PASSED WITH 100% SUCCESS!        ');
  console.log('================================================================\n');
}

runComprehensiveExpansionAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('AUDIT FAILED:', err);
    process.exit(1);
  });
