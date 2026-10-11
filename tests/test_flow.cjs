const assert = require('assert');
const { spawn } = require('child_process');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5000';

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (res.ok) return true;
    } catch (e) {
      // Wait 500ms before retrying
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return false;
}

async function testCompleteFlow() {
  console.log('--- STARTING EXPLOREINDIA INTEGRATION TEST SUITE ---');

  let serverProcess = null;
  const isUp = await waitForServer(1000);

  if (!isUp) {
    console.log('Backend not currently running. Starting backend on port 5000 for test suite...');
    const isWin = process.platform === 'win32';
    const rootDir = require('path').resolve(__dirname, '..');
    let serverOutput = '';
    serverProcess = spawn(isWin ? 'npm.cmd' : 'npm', ['--prefix', 'backend', 'run', 'dev'], {
      cwd: rootDir,
      stdio: 'pipe',
      shell: isWin
    });
    if (serverProcess.stdout) serverProcess.stdout.on('data', d => { serverOutput += d.toString(); });
    if (serverProcess.stderr) serverProcess.stderr.on('data', d => { serverOutput += d.toString(); });

    const ready = await waitForServer(20000);
    if (!ready) {
      if (serverProcess) serverProcess.kill();
      throw new Error(`Failed to start backend server for testing within 20s. Server output:\n${serverOutput}`);
    }
    console.log('Backend test server started successfully.');
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    console.log('✓ Health check passed:', health.status);
    assert.strictEqual(health.status, 'ok');

    // 2. Discover places for Hyderabad
    const discRes = await fetch(`${BASE_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Hyderabad' })
    });
    const disc = await discRes.json();
    console.log(`✓ Discover query passed: City=${disc.city.name}, Places count=${disc.places.length}`);
    assert(disc.places.length > 0);
    const samplePlace = disc.places[0];

    // 3. User Login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sathanidineshkumar@gmail.com', password: 'user123' })
    });
    const loginData = await loginRes.json();
    console.log('✓ User login passed:', loginData.user.name, 'Token exists:', !!loginData.user.token);
    assert(loginData.user.token);
    const userToken = loginData.user.token;

    // 4. Toggle Favorites (idempotent for testing)
    const favRes = await fetch(`${BASE_URL}/api/favorites/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ placeId: samplePlace.id })
    });
    const favData = await favRes.json();
    console.log('✓ Toggle favorite passed:', favData.action, 'Favorites count:', favData.favorites.length);
    assert(favData.success);

    // Ensure item is favorited for profile verification test
    if (favData.action === 'removed') {
      await fetch(`${BASE_URL}/api/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ placeId: samplePlace.id })
      });
    }

    // 5. Submit Review
    const revRes = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        placeId: samplePlace.id,
        rating: 5,
        text: 'Exceptional ambiance, delicious regional cuisine, and hospitable staff!'
      })
    });
    const revData = await revRes.json();
    console.log('✓ Submit review passed:', revData.review.id, 'Approved:', revData.review.approved);
    assert(revData.review.id);
    const reviewId = revData.review.id;

    // 6. Create Trip & Itinerary
    const tripRes = await fetch(`${BASE_URL}/api/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        name: 'Hyderabad Heritage Journey',
        destination: 'Hyderabad',
        days: 3
      })
    });
    const tripData = await tripRes.json();
    console.log('✓ Create trip passed: Trip ID=', tripData.id, 'Days=', tripData.days);
    assert(tripData.id);

    // 7. Add Place to Trip
    const addPlaceRes = await fetch(`${BASE_URL}/api/trips/${tripData.id}/add-place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        placeId: samplePlace.id,
        day: 1
      })
    });
    const updatedTrip = await addPlaceRes.json();
    console.log('✓ Add place to trip passed: Day 1 places count=', updatedTrip.itinerary[0].places.length);
    assert(updatedTrip.itinerary[0].places.length > 0);

    // 8. Create Hotel Booking
    // Clean up any previous test booking for this test date to ensure idempotency
    try {
      const prevRes = await fetch(`${BASE_URL}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (prevRes.ok) {
        const prevBookings = await prevRes.json();
        for (const pb of prevBookings) {
          if (pb.placeId === samplePlace.id && pb.date === '2026-11-10') {
            await fetch(`${BASE_URL}/api/bookings/${pb.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${userToken}` }
            });
          }
        }
      }
    } catch (_) {}

    const bookRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        placeId: samplePlace.id,
        date: '2026-11-10',
        dateOut: '2026-11-15',
        guests: 2,
        time: '14:00'
      })
    });
    const bookData = await bookRes.json();
    console.log('✓ Create booking passed: Booking ID=', bookData.id, 'Status=', bookData.status);
    assert(bookData.id);

    // 9. Admin Login & Moderation
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@exploreindia.com', password: 'admin123' })
    });
    const adminData = await adminLoginRes.json();
    console.log('✓ Admin login passed: Role=', adminData.user.role);
    assert.strictEqual(adminData.user.role, 'admin');
    const adminToken = adminData.user.token;

    // 10. Admin Analytics
    const analyticsRes = await fetch(`${BASE_URL}/api/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const analytics = await analyticsRes.json();
    console.log(`✓ Admin analytics passed: Users=${analytics.usersCount}, Places=${analytics.placesCount}, Reviews=${analytics.reviewsCount}`);
    assert(analytics.usersCount >= 2);

    // 11. Admin Approve Pending Review
    const approveRes = await fetch(`${BASE_URL}/api/admin/reviews/approve/${reviewId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const approveData = await approveRes.json();
    console.log('✓ Admin approve review passed:', approveData.message);
    assert(approveData.success);

    // 12. User Profile fetch
    const profileRes = await fetch(`${BASE_URL}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const profile = await profileRes.json();
    console.log(`✓ User profile fetched: Name=${profile.user.name}, Favorites count=${profile.favorites.length}`);
    assert(profile.favorites.length > 0);

    // 13. City-specific Image Uniqueness across cities (Hyderabad, Chennai, Mumbai, Bangalore, Delhi)
    const hydRes = await fetch(`${BASE_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Hyderabad' })
    });
    const hydData = await hydRes.json();

    const chnRes = await fetch(`${BASE_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Chennai' })
    });
    const chnData = await chnRes.json();

    const mumRes = await fetch(`${BASE_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Mumbai' })
    });
    const mumData = await mumRes.json();

    const blrRes = await fetch(`${BASE_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Bangalore' })
    });
    const blrData = await blrRes.json();

    const delRes = await fetch(`${BASE_URL}/api/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Delhi' })
    });
    const delData = await delRes.json();

    console.log('Verifying hero image uniqueness across different cities:');
    console.log(' - Hyderabad hero:', hydData.city.image);
    console.log(' - Chennai hero:  ', chnData.city.image);
    console.log(' - Mumbai hero:   ', mumData.city.image);
    console.log(' - Bangalore hero:', blrData.city.image);
    console.log(' - Delhi hero:    ', delData.city.image);

    const heroImages = [hydData.city.image, chnData.city.image, mumData.city.image, blrData.city.image, delData.city.image];
    const uniqueHeroImages = new Set(heroImages);
    assert.strictEqual(uniqueHeroImages.size, 5, 'All 5 cities (Hyderabad, Chennai, Mumbai, Bangalore, Delhi) must have distinct hero images');
    console.log('✓ City hero image uniqueness verified across all 5 cities!');

    // 14. Image Uniqueness WITHIN the same city page (no duplicate images across cards)
    const hydPhotos = hydData.places.map(p => p.photos[0]).filter(Boolean);
    const hydUniquePhotos = new Set(hydPhotos);
    console.log(`Hyderabad place photo uniqueness: ${hydUniquePhotos.size}/${hydPhotos.length} unique photos`);
    assert.strictEqual(hydUniquePhotos.size, hydPhotos.length, 'Every place card in Hyderabad must have a unique photo');

    const chnPhotos = chnData.places.map(p => p.photos[0]).filter(Boolean);
    const chnUniquePhotos = new Set(chnPhotos);
    console.log(`Chennai place photo uniqueness: ${chnUniquePhotos.size}/${chnPhotos.length} unique photos`);
    assert.strictEqual(chnUniquePhotos.size, chnPhotos.length, 'Every place card in Chennai must have a unique photo');

    const blrPhotos = blrData.places.map(p => p.photos[0]).filter(Boolean);
    const blrUniquePhotos = new Set(blrPhotos);
    console.log(`Bangalore place photo uniqueness: ${blrUniquePhotos.size}/${blrPhotos.length} unique photos`);
    assert.strictEqual(blrUniquePhotos.size, blrPhotos.length, 'Every place card in Bangalore must have a unique photo');

    const mumPhotos = mumData.places.map(p => p.photos[0]).filter(Boolean);
    const mumUniquePhotos = new Set(mumPhotos);
    console.log(`Mumbai place photo uniqueness: ${mumUniquePhotos.size}/${mumPhotos.length} unique photos`);
    assert.strictEqual(mumUniquePhotos.size, mumPhotos.length, 'Every place card in Mumbai must have a unique photo');

    const delPhotos = delData.places.map(p => p.photos[0]).filter(Boolean);
    const delUniquePhotos = new Set(delPhotos);
    console.log(`Delhi place photo uniqueness: ${delUniquePhotos.size}/${delPhotos.length} unique photos`);
    assert.strictEqual(delUniquePhotos.size, delPhotos.length, 'Every place card in Delhi must have a unique photo');
    console.log('✓ In-page image uniqueness verified across all 5 cities!');

    // 15. Reverse Geocoding API verification
    const geoRes = await fetch(`${BASE_URL}/api/location/reverse-geocode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: 17.3850, lng: 78.4867 })
    });
    const geoData = await geoRes.json();
    console.log(`✓ Reverse geocoding passed: (${geoData.lat}, ${geoData.lng}) -> City=${geoData.city}, State=${geoData.state}`);
    assert(geoData.city.toLowerCase().includes('hyderabad'), 'Reverse geocoding must identify Hyderabad');

    // 16. Weather API verification
    const weatherRes = await fetch(`${BASE_URL}/api/location/weather?lat=17.3850&lng=78.4867`);
    const weatherData = await weatherRes.json();
    console.log(`✓ Weather query passed: Temp=${weatherData.temperature}°C, Condition=${weatherData.condition}`);
    assert(typeof weatherData.temperature === 'number');
    assert(weatherData.condition);

    // 17. Dynamic City Image API verification
    const imgRes = await fetch(`${BASE_URL}/api/images?city=Hyderabad&feature=charminar`);
    const imgData = await imgRes.json();
    console.log(`✓ Dynamic city image passed: Query=${imgData.query}, URL=${imgData.imageUrl}`);
    assert(imgData.imageUrl);
    assert(imgData.imageUrl.includes('photo-'));

    console.log('\n--- ALL 17 INTEGRATION TESTS PASSED PERFECTLY! ---');
  } finally {
    if (serverProcess) {
      console.log('Stopping test backend process...');
      try { serverProcess.kill(); } catch (e) {}
    }
  }
}

testCompleteFlow()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Test flow failed:', err);
    process.exit(1);
  });
