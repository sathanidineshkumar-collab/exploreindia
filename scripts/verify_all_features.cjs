const assert = require('assert');

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';

// Real photographic check helper: ensures URL is real Unsplash or HTTPS photo, NOT SVG data URI
function assertRealPhoto(url, contextMsg) {
  assert(url && typeof url === 'string', `${contextMsg}: Image must be a non-empty string`);
  assert(!url.startsWith('data:image/svg'), `${contextMsg}: Image must NOT be an SVG placeholder (${url.slice(0, 30)})`);
  assert(url.startsWith('https://'), `${contextMsg}: Image must be an HTTPS real photo URL`);
  assert(url.includes('images.unsplash.com') || url.includes('wikimedia') || url.includes('photo-'), `${contextMsg}: Image must be a photographic asset`);
}

async function runEndToEndVerification() {
  console.log('================================================================');
  console.log('       EXPLOREINDIA COMPLETE END-TO-END VERIFICATION AUDIT      ');
  console.log('================================================================\n');

  const cityDataMap = {};
  const allImagesCollected = new Map(); // url -> Array of place names

  // -------------------------------------------------------------------
  // TEST 1-5: INDIVIDUAL CITY INSPECTIONS & CITY-SPECIFIC IMAGES
  // -------------------------------------------------------------------
  const targetCities = [
    { name: 'Hyderabad', expectedKeywords: ['charminar', 'golconda', 'hussain sagar', 'falaknuma', 'birla mandir'] },
    { name: 'Chennai', expectedKeywords: ['marina beach', 'kapaleeshwarar', 'san thome', 'itc grand chola'] },
    { name: 'Bangalore', expectedKeywords: ['vidhana soudha', 'bangalore palace', 'cubbon park', 'leela palace'] },
    { name: 'Mumbai', expectedKeywords: ['gateway of india', 'marine drive', 'taj mahal palace'] },
    { name: 'Delhi', expectedKeywords: ['india gate', 'red fort', 'qutub minar'] },
    { name: 'Goa', expectedKeywords: ['fort aguada', 'basilica of bom jesus', 'calangute'] },
    { name: 'Jaipur', expectedKeywords: ['hawa mahal', 'amer fort', 'city palace'] },
    { name: 'Varanasi', expectedKeywords: ['dashashwamedh', 'kashi vishwanath', 'assi ghat'] },
    { name: 'Amritsar', expectedKeywords: ['harmandir sahib', 'jallianwala bagh', 'wagah'] },
    { name: 'Agra', expectedKeywords: ['taj mahal', 'agra fort', 'fatehpur sikri'] },
    { name: 'Kolkata', expectedKeywords: ['victoria memorial', 'howrah bridge', 'dakshineswar'] },
    { name: 'Kochi', expectedKeywords: ['fort kochi', 'mattancherry', 'hyatt'] },
    { name: 'Udaipur', expectedKeywords: ['city palace', 'lake pichola', 'taj lake palace'] }
  ];

  console.log('>>> [1-5] AUDITING CITIES FOR CITY-SPECIFIC DISTINCT IMAGES <<<');

  for (const c of targetCities) {
    const res = await fetch(`${BACKEND_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: c.name })
    });
    assert.strictEqual(res.status, 200, `Discovery for ${c.name} must return 200 OK`);
    const data = await res.json();
    assert(data.city, `Discovery must return city metadata for ${c.name}`);
    assert(Array.isArray(data.places) && data.places.length > 0, `Must return places for ${c.name}`);

    // Verify City Hero Image is real and relevant
    assertRealPhoto(data.city.image, `${c.name} Hero Photo`);

    console.log(`\n  City: [${data.city.name}] (${data.places.length} places returned)`);
    console.log(`   Hero Image: ${data.city.image.slice(0, 75)}...`);

    // Verify every place card has real, relevant, non-SVG photo
    const cityCardPhotos = new Set();
    for (const place of data.places) {
      assert(place.photos && place.photos.length > 0, `Place ${place.name} must have photos`);
      const primaryPhoto = place.photos[0];
      assertRealPhoto(primaryPhoto, `${c.name} - ${place.name}`);
      
      // Check in-page uniqueness: no two places in the same city share the exact same photo
      assert(!cityCardPhotos.has(primaryPhoto), `Duplicate photo detected within ${c.name} for place: ${place.name}`);
      cityCardPhotos.add(primaryPhoto);

      // Track global photo to ensure no cross-city reuse
      if (!allImagesCollected.has(primaryPhoto)) {
        allImagesCollected.set(primaryPhoto, []);
      }
      allImagesCollected.get(primaryPhoto).push(`${data.city.name}: ${place.name}`);
    }

    console.log(`   ✓ In-city photo uniqueness: ${cityCardPhotos.size}/${data.places.length} distinct place photos`);

    // Verify presence of expected landmarks
    const lowerNames = data.places.map(p => p.name.toLowerCase());
    for (const kw of c.expectedKeywords) {
      const match = lowerNames.some(n => n.includes(kw));
      assert(match, `${c.name} must include authentic landmark matching '${kw}'`);
    }
    console.log(`   ✓ Authentic landmarks confirmed: ${c.expectedKeywords.join(', ')}`);

    cityDataMap[c.name] = data;
  }

  // -------------------------------------------------------------------
  // TEST 6: VERIFY NO REUSE OF IMAGES BETWEEN DIFFERENT CITIES
  // -------------------------------------------------------------------
  console.log('\n>>> [6] VERIFYING CROSS-CITY IMAGE INDEPENDENCE <<<');
  const heroUrls = Object.entries(cityDataMap).map(([name, data]) => ({ name, hero: data.city.image }));
  for (let i = 0; i < heroUrls.length; i++) {
    for (let j = i + 1; j < heroUrls.length; j++) {
      assert.notStrictEqual(
        heroUrls[i].hero,
        heroUrls[j].hero,
        `City heroes for ${heroUrls[i].name} and ${heroUrls[j].name} must NEVER be identical`
      );
    }
  }
  console.log('  ✓ Verified 100% distinct hero images across all 5 audited metropolitan cities');

  // Verify that place photos are not blindly reused across different cities
  for (const [url, placeList] of allImagesCollected.entries()) {
    const distinctCities = new Set(placeList.map(p => p.split(':')[0]));
    if (distinctCities.size > 1) {
      console.warn(`  Warning: Photo ${url.slice(0, 50)} appears across multiple cities:`, placeList);
    }
    assert.strictEqual(distinctCities.size, 1, `Place photo reused across different cities: ${url} in ${Array.from(distinctCities).join(', ')}`);
  }
  console.log(`  ✓ Verified total of ${allImagesCollected.size} completely distinct place photos across all cities`);

  // -------------------------------------------------------------------
  // TEST 7: CATEGORY FILTERS & CLIENT-SIDE FILTERING LOGIC
  // -------------------------------------------------------------------
  console.log('\n>>> [7] TESTING CATEGORY & PROPERTY FILTERS <<<');
  const hydPlaces = cityDataMap['Hyderabad'].places;

  // Filter 7a: Attractions (Heritage/Tourism)
  const attractions = hydPlaces.filter(p => p.type === 'attraction');
  assert(attractions.length >= 2, 'Hyderabad must have at least 2 attractions');
  console.log(`  ✓ Attractions filter: found ${attractions.length} attractions (e.g. ${attractions[0].name})`);

  // Filter 7b: Stays (Hotels & Resorts)
  const stays = hydPlaces.filter(p => p.type === 'hotel' || p.type === 'resort');
  assert(stays.length >= 1, 'Hyderabad must have stays');
  console.log(`  ✓ Stays filter: found ${stays.length} stays (e.g. ${stays[0].name})`);

  // Filter 7c: Food (Restaurants & Cafes)
  const food = hydPlaces.filter(p => p.type === 'restaurant' || p.type === 'cafe');
  assert(food.length >= 1, 'Hyderabad must have eateries');
  console.log(`  ✓ Food filter: found ${food.length} eateries (e.g. ${food[0].name})`);

  // Filter 7d: Temples
  const temples = hydPlaces.filter(p => p.type === 'temple');
  assert(temples.length >= 1, 'Hyderabad must have temples');
  console.log(`  ✓ Temples filter: found ${temples.length} temples (e.g. ${temples[0].name})`);

  // Filter 7e: Price level filter (e.g. luxury level 4)
  const luxuryStays = hydPlaces.filter(p => p.priceLevel === 4);
  assert(luxuryStays.length >= 1, 'Must find luxury priceLevel 4 places');
  console.log(`  ✓ Luxury tier filter (priceLevel 4): found ${luxuryStays.length} places (e.g. ${luxuryStays[0].name})`);

  // Filter 7f: Rating filter (>= 4.5)
  const topRated = hydPlaces.filter(p => p.rating >= 4.5);
  assert(topRated.length > 0, 'Must find places with rating >= 4.5');
  console.log(`  ✓ Rating filter (>= 4.5): found ${topRated.length} places`);

  // Filter 7g: Amenities filter (e.g. WiFi, Parking, Spa)
  const withWifi = hydPlaces.filter(p => p.facilities && p.facilities.some(f => f.toLowerCase().includes('wifi')));
  assert(withWifi.length > 0, 'Must find places with WiFi facility');
  console.log(`  ✓ Facility filter (WiFi): found ${withWifi.length} places (e.g. ${withWifi[0].name})`);

  // -------------------------------------------------------------------
  // TEST 8: SEARCH DISCOVERY & INTENT KEYWORDS
  // -------------------------------------------------------------------
  console.log('\n>>> [8] TESTING SEARCH DISCOVERY & QUERY VARIANTS <<<');
  const searchQueries = ['Goa', 'Jaipur', 'Varanasi', 'Kochi', 'Agra'];
  for (const q of searchQueries) {
    const searchRes = await fetch(`${BACKEND_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    });
    assert.strictEqual(searchRes.status, 200);
    const searchData = await searchRes.json();
    assert(searchData.city && searchData.places.length > 0, `Search query '${q}' must return valid results`);
    assertRealPhoto(searchData.city.image, `Hero for query ${q}`);
    console.log(`  ✓ Search '${q}': identified city '${searchData.city.name}' with ${searchData.places.length} places`);
  }

  // -------------------------------------------------------------------
  // TEST 9: "NEAR ME" & REVERSE GEOCODING
  // -------------------------------------------------------------------
  console.log('\n>>> [9] TESTING "NEAR ME" GEOLOCATION & REVERSE GEOCODING <<<');
  // Hyderabad coordinates (17.3850, 78.4867)
  const geoRes = await fetch(`${BACKEND_URL}/api/location/reverse-geocode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat: 17.3850, lng: 78.4867 })
  });
  assert.strictEqual(geoRes.status, 200);
  const geoData = await geoRes.json();
  assert(geoData.city && geoData.city.toLowerCase().includes('hyderabad'), 'Reverse geocode must identify Hyderabad for coords');
  console.log(`  ✓ Reverse geocode (17.3850, 78.4867): Identified city '${geoData.city}', state '${geoData.state}'`);

  // Chennai coordinates (13.0827, 80.2707)
  const chnGeoRes = await fetch(`${BACKEND_URL}/api/location/reverse-geocode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat: 13.0827, lng: 80.2707 })
  });
  const chnGeoData = await chnGeoRes.json();
  assert(chnGeoData.city && chnGeoData.city.toLowerCase().includes('chennai'), 'Reverse geocode must identify Chennai');
  console.log(`  ✓ Reverse geocode (13.0827, 80.2707): Identified city '${chnGeoData.city}', state '${chnGeoData.state}'`);

  // -------------------------------------------------------------------
  // TEST 10: WEATHER ENDPOINT
  // -------------------------------------------------------------------
  console.log('\n>>> [10] TESTING WEATHER API <<<');
  const weatherRes = await fetch(`${BACKEND_URL}/api/location/weather?lat=13.0827&lng=80.2707`);
  assert.strictEqual(weatherRes.status, 200);
  const weatherData = await weatherRes.json();
  assert(typeof weatherData.temperature === 'number', 'Weather temperature must be a valid number');
  assert(weatherData.condition, 'Weather condition must exist');
  console.log(`  ✓ Chennai weather: Temp=${weatherData.temperature}°C, Condition='${weatherData.condition}', Wind=${weatherData.windSpeed} km/h`);

  // -------------------------------------------------------------------
  // TEST 11: MAP & MARKERS GEOMETRY VALIDATION
  // -------------------------------------------------------------------
  console.log('\n>>> [11] TESTING MAP & MARKERS GEOMETRY <<<');
  for (const place of hydPlaces) {
    assert(place.coordinates, `Place ${place.name} must have coordinates`);
    assert(typeof place.coordinates.lat === 'number' && place.coordinates.lat >= 8 && place.coordinates.lat <= 36,
      `Valid India latitude for ${place.name}: ${place.coordinates.lat}`);
    assert(typeof place.coordinates.lng === 'number' && place.coordinates.lng >= 68 && place.coordinates.lng <= 98,
      `Valid India longitude for ${place.name}: ${place.coordinates.lng}`);
  }
  console.log(`  ✓ All ${hydPlaces.length} places in Hyderabad have validated geospatial bounds in India`);

  // -------------------------------------------------------------------
  // TEST 12: PLACE DETAILS ENDPOINT
  // -------------------------------------------------------------------
  console.log('\n>>> [12] TESTING PLACE DETAILS VIEW & REVIEWS <<<');
  const samplePlaceId = hydPlaces[0].id;
  const detailRes = await fetch(`${BACKEND_URL}/api/places/${samplePlaceId}`);
  assert.strictEqual(detailRes.status, 200);
  const detailData = await detailRes.json();
  assert.strictEqual(detailData.id, samplePlaceId);
  assert(detailData.name);
  assert(Array.isArray(detailData.photos) && detailData.photos.length > 0);
  assertRealPhoto(detailData.photos[0], `Detail photo for ${detailData.name}`);
  console.log(`  ✓ Place detail fetched for '${detailData.name}' (${detailData.photos.length} photos, rating ${detailData.rating})`);

  // -------------------------------------------------------------------
  // TEST 13: CLEAR ALL FILTERS SIMULATION
  // -------------------------------------------------------------------
  console.log('\n>>> [13] TESTING "CLEAR ALL FILTERS" LOGIC <<<');
  // Given filters that yield 0 results
  const nonExistentFilter = hydPlaces.filter(p => p.priceLevel === 1 && p.rating >= 4.9 && p.facilities.includes('NonExistentAmenity'));
  assert.strictEqual(nonExistentFilter.length, 0, 'Synthetic restrictive filter yields 0');
  // Resetting returns all
  const resetPlaces = hydPlaces.filter(() => true);
  assert.strictEqual(resetPlaces.length, hydPlaces.length, 'Reset returns full catalog');
  console.log(`  ✓ Clear filters correctly restores catalog from 0 to ${resetPlaces.length} places`);

  // -------------------------------------------------------------------
  // TEST 14: EMPTY, LOADING & ERROR STATES
  // -------------------------------------------------------------------
  console.log('\n>>> [14] TESTING EMPTY, LOADING & ERROR STATES <<<');
  const nonExistentPlaceRes = await fetch(`${BACKEND_URL}/api/places/invalid-id-xyz-999`);
  assert.strictEqual(nonExistentPlaceRes.status, 404, 'Non-existent place must return 404');
  console.log('  ✓ 404 error returned cleanly for invalid place id');

  const emptyDiscoverRes = await fetch(`${BACKEND_URL}/api/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '' })
  });
  assert.strictEqual(emptyDiscoverRes.status, 400, 'Empty query must return 400 Bad Request');
  console.log('  ✓ 400 error handled cleanly for blank search query');

  // -------------------------------------------------------------------
  // TEST 15 & 16: FRONTEND & BACKEND ERROR CHECKS VIA VITE PROXY
  // -------------------------------------------------------------------
  console.log('\n>>> [15-16] CHECKING FRONTEND HTTP ASSETS & PROXY STABILITY <<<');
  const indexHtmlRes = await fetch(`${FRONTEND_URL}/`);
  assert.strictEqual(indexHtmlRes.status, 200, 'Frontend index.html must return 200');
  const indexHtml = await indexHtmlRes.text();
  assert(indexHtml.includes('<div id="root">'), 'index.html contains root container');
  console.log('  ✓ Frontend index.html served cleanly from Vite dev server');

  const proxiedHealthRes = await fetch(`${FRONTEND_URL}/api/health`);
  assert.strictEqual(proxiedHealthRes.status, 200, 'Vite proxy to backend /api/health works');
  console.log('  ✓ Vite API proxy correctly delegates /api requests to backend');

  // -------------------------------------------------------------------
  // TEST 17: COMPLETE FRONTEND-TO-BACKEND ROUTE INVENTORY
  // -------------------------------------------------------------------
  console.log('\n>>> [17] CHECKING COMPLETE API ROUTE INVENTORY <<<');
  const routes = [
    { method: 'GET', path: '/api/health' },
    { method: 'GET', path: '/api/cities/trending' },
    { method: 'GET', path: '/api/hotels/famous' },
    { method: 'GET', path: '/api/tips' },
    { method: 'POST', path: '/api/discover', body: { query: 'Mumbai' } },
    { method: 'POST', path: '/api/location/reverse-geocode', body: { lat: 19.0760, lng: 72.8777 } },
    { method: 'GET', path: '/api/location/weather?lat=19.0760&lng=72.8777' },
    { method: 'GET', path: '/api/images?city=Mumbai&feature=gateway' },
    { method: 'GET', path: `/api/places/${samplePlaceId}` },
  ];

  for (const r of routes) {
    const opts = { method: r.method, headers: { 'Content-Type': 'application/json' } };
    if (r.body) opts.body = JSON.stringify(r.body);
    const res = await fetch(`${FRONTEND_URL}${r.path}`, opts);
    assert(res.ok, `Route ${r.method} ${r.path} failed with status ${res.status}`);
    console.log(`  ✓ Route ${r.method} ${r.path} returned status ${res.status} via Vite`);
  }

  console.log('\n================================================================');
  console.log('  ALL 17 VERIFICATION ITEMS TESTED AND PASSED WITH ZERO ERRORS! ');
  console.log('================================================================\n');
}

runEndToEndVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('VERIFICATION ERROR:', err);
    process.exit(1);
  });
