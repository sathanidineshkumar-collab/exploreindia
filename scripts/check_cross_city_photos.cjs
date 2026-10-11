const CITIES = ['Hyderabad', 'Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Jaipur', 'Goa', 'Varanasi', 'Agra', 'Kolkata', 'Amritsar', 'Udaipur', 'Kochi'];

async function main() {
  const photoMap = new Map(); // photoUrl -> Set(cities)
  const placePhotoMap = new Map(); // photoUrl -> Array({ city, place })

  for (const city of CITIES) {
    const res = await fetch('http://localhost:5000/api/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: city })
    });
    if (!res.ok) {
      console.error(`Failed to fetch for ${city}: ${res.status}`);
      continue;
    }
    const data = await res.json();
    
    // Check hero photo
    const hero = data.city.image;
    if (!photoMap.has(hero)) photoMap.set(hero, new Set());
    photoMap.get(hero).add(`${city} (HERO)`);

    // Check place photos
    for (const place of data.places) {
      for (const p of place.photos) {
        if (!photoMap.has(p)) photoMap.set(p, new Set());
        photoMap.get(p).add(city);

        if (!placePhotoMap.has(p)) placePhotoMap.set(p, []);
        placePhotoMap.get(p).push({ city, place: place.name });
      }
    }
  }

  let dupCount = 0;
  for (const [url, cities] of photoMap.entries()) {
    if (cities.size > 1) {
      dupCount++;
      console.log(`\nDUPLICATE [${cities.size} cities]: ${url}`);
      console.log('Cities:', Array.from(cities));
      const usages = placePhotoMap.get(url) || [];
      usages.forEach(u => console.log(` - ${u.city}: ${u.place}`));
    }
  }

  console.log(`\nTotal cross-city duplicate photos: ${dupCount}`);
}

main();
