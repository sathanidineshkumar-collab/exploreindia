const assert = require('assert');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:5000';

async function waitForServer(timeoutMs = 15000) {
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

    console.log('\n--- ALL 12 INTEGRATION TESTS PASSED PERFECTLY! ---');
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
