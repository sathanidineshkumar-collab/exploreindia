const http = require('http');

function postDiscover(cityName) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: cityName });
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/discover',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  const testCities = [
    'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 
    'Goa', 'Jaipur', 'Varanasi', 'Amritsar', 'Agra', 
    'Kolkata', 'Kochi', 'Udaipur'
  ];

  console.log('Testing /api/places/discover for all cities...\n');

  for (const city of testCities) {
    try {
      const res = await postDiscover(city);
      const placeNames = (res.places || []).map(p => p.name).slice(0, 3).join(', ');
      console.log(`[${city.padEnd(10)}] Hero: ${(res.city?.image || '').slice(0, 50)}... | Places (${res.places?.length || 0}): ${placeNames}`);
    } catch (err) {
      console.error(`[${city}] Failed:`, err.message);
    }
  }
}

run();
