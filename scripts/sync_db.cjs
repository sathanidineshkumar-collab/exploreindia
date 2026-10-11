const http = require('http');
const fs = require('fs');
const path = require('path');

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

async function sync() {
  const cities = [
    'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 
    'Goa', 'Jaipur', 'Varanasi', 'Amritsar', 'Agra', 
    'Kolkata', 'Kochi', 'Udaipur', 'Tirupati'
  ];

  const targetFiles = [
    path.resolve(__dirname, '../backend/data_store.json'),
    path.resolve(__dirname, '../data_store.json')
  ];

  const allCuratedPlaces = [];
  const allCuratedCities = [];

  for (const c of cities) {
    try {
      const res = await postDiscover(c);
      if (res.city) {
        allCuratedCities.push(res.city);
      }
      if (res.places && Array.isArray(res.places)) {
        for (const p of res.places) {
          allCuratedPlaces.push(p);
        }
      }
      console.log(`Fetched ${c}: ${res.places?.length || 0} places`);
    } catch (e) {
      console.error(`Failed ${c}:`, e.message);
    }
  }

  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) continue;
    const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Update cities
    db.cities = db.cities || [];
    for (const c of allCuratedCities) {
      const idx = db.cities.findIndex(item => item.name.toLowerCase() === c.name.toLowerCase());
      if (idx >= 0) {
        db.cities[idx] = { ...db.cities[idx], ...c };
      } else {
        db.cities.push(c);
      }
    }

    // Replace curated city places with authentic ones
    const curatedCityNames = new Set(cities.map(s => s.toLowerCase()));
    const nonCurated = (db.places || []).filter(p => !curatedCityNames.has(p.city.toLowerCase()));
    db.places = [...allCuratedPlaces, ...nonCurated];

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Synced ${filePath} -> ${db.places.length} places, ${db.cities.length} cities`);
  }

  // Also sync backend/src/data/cityImageCatalog.json
  const catalogEntries = allCuratedPlaces.map(p => {
    let cat = "Heritage";
    if (p.type === "hotel" || p.type === "resort") cat = "Stays";
    else if (p.type === "restaurant" || p.type === "cafe") cat = "Food";
    else if (p.type === "temple") cat = "Temples";
    else if (p.subtypes?.some(s => s.toLowerCase().includes("beach"))) cat = "Beaches";
    else if (p.subtypes?.some(s => s.toLowerCase().includes("park") || s.toLowerCase().includes("lake"))) cat = "Nature";

    return {
      city: p.city,
      place: p.name,
      category: cat,
      image: p.photos[0]
    };
  });

  const catPath = path.resolve(__dirname, '../backend/src/data/cityImageCatalog.json');
  fs.writeFileSync(catPath, JSON.stringify(catalogEntries, null, 2), 'utf8');
  console.log(`Synced cityImageCatalog.json -> ${catalogEntries.length} entries`);
}

sync();
