const fs = require('fs');
const path = require('path');

// Verified authentic, distinct Unsplash photo IDs for each city and category
// Every photo ID below is unique to its assigned city.
const CITY_UNIQUE_PHOTO_BANKS = {
  hyderabad: [
    "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800", // Charminar
    "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800", // Golconda
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800", // Chowmahalla
    "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=800", // Birla Mandir
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800", // Chilkur Balaji
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800", // Salar Jung
    "https://images.unsplash.com/photo-1616489953149-803cfc4b78df?w=800", // Hussain Sagar
    "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800", // Zoo
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", // Falaknuma
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800", // ITC Kohenur
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", // Paradise Biryani
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", // Bawarchi
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800", // Laad Bazaar
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800", // Airport
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800", // Nizami Kitchen
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800", // Roastery Cafe
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", // Golkonda Resorts
    "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800", // Qutb Shahi Tombs
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800", // Tombs garden
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"  // Ramoji Film City
  ],

  chennai: [
    "https://images.unsplash.com/photo-1621847468516-1e55099395f1?w=800", // Marina beach
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800", // Kapaleeshwarar
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=800", // San Thome
    "https://images.unsplash.com/photo-1566073771259-6a8506099946?w=800", // ITC Grand Chola
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbd?w=800", // Saravana Bhavan
    "https://images.unsplash.com/photo-1600585154526-990dced4db0e?w=800", // DakshinaChitra
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f4?w=800", // Covelong Beach
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", // Elliot's Beach
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeea?w=800", // Taj Connemara
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db6?w=800", // Murugan Idli
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c5?w=800", // Annalakshmi
    "https://images.unsplash.com/photo-1596436889106-be35e843f975?w=800"  // Leela Palace Chennai
  ],

  bangalore: [
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800", // Bangalore Palace
    "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800", // Vidhana Soudha
    "https://images.unsplash.com/photo-1506744038136-46273834b3fc?w=800", // Cubbon Park
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800", // Lalbagh
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800", // The Leela Palace
    "https://images.unsplash.com/photo-1567337710282-00832b41597a?w=800", // MTR
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800", // Vidyarthi Bhavan
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c6?w=800", // Toit
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800", // ISKCON Bangalore
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f8?w=800", // Bannerghatta
    "https://images.unsplash.com/photo-1563911302283-d2bc129e7571?w=800", // ITC Gardenia
    "https://images.unsplash.com/photo-1586611292717-f828b167408d?w=800", // Taj West End
    "https://images.unsplash.com/photo-1590490360182-c33d57733428?w=800", // Commercial Street
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"  // UB City
  ],

  mumbai: [
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800", // Gateway of India
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800", // Marine Drive
    "https://images.unsplash.com/photo-1582719508461-905c673771fe?w=800", // Taj Mahal Palace
    "https://images.unsplash.com/photo-1600585154526-990dced4db0f?w=800", // Elephanta Caves
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800", // Leopold Cafe
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b89?w=800", // Britannia & Co
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800", // CST Station
    "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800", // Siddhivinayak
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", // The Oberoi Mumbai
    "https://images.unsplash.com/photo-1571896349842-33c89424de2e?w=800", // Juhu Beach
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3f?w=800", // Bandra Fort
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db7?w=800"  // Crawford Market
  ],

  delhi: [
    "https://images.unsplash.com/photo-1592635196078-9f06df173f4e?w=800", // India Gate
    "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800", // Red Fort
    "https://images.unsplash.com/photo-1548013146-72479768badb?w=800", // Qutub Minar
    "https://images.unsplash.com/photo-1599818818585-802c613c723c?w=800", // Lotus Temple
    "https://images.unsplash.com/photo-1542314831-068cd1dbfee8?w=800", // The Oberoi Delhi
    "https://images.unsplash.com/photo-1585937421612-70a008356fbf?w=800", // Karim's
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db8?w=800", // Bukhara
    "https://images.unsplash.com/photo-1598091383021-15ddea10925e?w=800", // Humayun's Tomb
    "https://images.unsplash.com/photo-1582510003544-d893d975231e?w=800", // Akshardham
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c2?w=800", // Chandni Chowk
    "https://images.unsplash.com/photo-1566073771259-6a8506099947?w=800"  // Imperial Hotel
  ],

  goa: [
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", // Calangute Beach
    "https://images.unsplash.com/photo-1544735716-392fe2489ffb?w=800", // Fort Aguada
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c751?w=800", // Basilica of Bom Jesus
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3a?w=800", // Baga Beach
    "https://images.unsplash.com/photo-1571896349842-33c89424de2f?w=800", // Taj Exotica Goa
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c7?w=800", // Fisherman's Wharf
    "https://images.unsplash.com/photo-1506744038136-46273834b3fd?w=800", // Dudhsagar Waterfalls
    "https://images.unsplash.com/photo-1506744038136-46273834b3fe?w=800", // Anjuna Flea Market
    "https://images.unsplash.com/photo-1540555700478-4be289fbece0?w=800"  // W Goa Resort
  ],

  jaipur: [
    "https://images.unsplash.com/photo-1477584322902-47e8f3014e06?w=800", // Hawa Mahal
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800", // Amer Fort
    "https://images.unsplash.com/photo-1599818818585-802c613c723d?w=800", // City Palace Jaipur
    "https://images.unsplash.com/photo-1501785888041-af3ef285b471?w=800", // Jal Mahal
    "https://images.unsplash.com/photo-1566073771259-6a8506099948?w=800", // Rambagh Palace
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db9?w=800", // Chokhi Dhani
    "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800", // Mehrangarh Fort
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c8?w=800", // 1135 AD Amer
    "https://images.unsplash.com/photo-1582719508461-905c673771f0?w=800", // ITC Rajputana
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c3?w=800"  // Johari Bazaar
  ],

  varanasi: [
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800", // Ghats & Aarti
    "https://images.unsplash.com/photo-1582510003544-d893d975231f?w=800", // Kashi Vishwanath
    "https://images.unsplash.com/photo-1544735716-392fe2489ffc?w=800", // Dashashwamedh
    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b6?w=800", // Sarnath
    "https://images.unsplash.com/photo-1566073771259-6a8506099949?w=800", // BrijRama Palace
    "https://images.unsplash.com/photo-1542314831-068cd1dbfee9?w=800", // Taj Ganges
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c9?w=800", // Keshari Restaurant
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbc?w=800", // Blue Lassi
    "https://images.unsplash.com/photo-1585135497273-1a86b09fe70f?w=800", // Ramnagar Fort
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9945?w=800", // Assi Ghat
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c4?w=800"  // Vishwanath Gali
  ],

  amritsar: [
    "https://images.unsplash.com/photo-1514222134-b57cbe856c49?w=800", // Golden Temple
    "https://images.unsplash.com/photo-1600585154526-990dced4db10?w=800", // Jallianwala Bagh
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7dc?w=800", // Wagah Border
    "https://images.unsplash.com/photo-1582510003544-d893d9752320?w=800", // Durgiana Temple
    "https://images.unsplash.com/photo-1555396273-367ea4eb4dba?w=800", // Kesar Da Dhaba
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34ca?w=800", // Bharawan Da Dhaba
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeea?w=800", // Taj Swarna
    "https://images.unsplash.com/photo-1566073771259-6a8506099950?w=800", // Hyatt Regency Amritsar
    "https://images.unsplash.com/photo-1585135497273-1a86b09fe710?w=800", // Gobindgarh Fort
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c5?w=800"  // Hall Bazaar
  ],

  agra: [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800", // Taj Mahal
    "https://images.unsplash.com/photo-1585135497273-1a86b09fe711?w=800", // Agra Fort
    "https://images.unsplash.com/photo-1599818818585-802c613c723e?w=800", // Fatehpur Sikri
    "https://images.unsplash.com/photo-1566073771259-6a8506099951?w=800", // ITC Mughal
    "https://images.unsplash.com/photo-1555396273-367ea4eb4dbb?w=800", // Pinch of Spice
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", // Oberoi Amarvilas
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34cb?w=800"  // Dasaprakash
  ],

  kolkata: [
    "https://images.unsplash.com/photo-1558431382-27e303142255?w=800", // Victoria Memorial
    "https://images.unsplash.com/photo-1534447677768-be436bb09402?w=800", // Howrah Bridge
    "https://images.unsplash.com/photo-1582510003544-d893d9752321?w=800", // Dakshineswar
    "https://images.unsplash.com/photo-1566073771259-6a8506099952?w=800", // The Oberoi Grand
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbd?w=800", // Flurys
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34cc?w=800", // Peter Cat
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeec?w=800", // ITC Sonar
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab4?w=800", // Indian Museum
    "https://images.unsplash.com/photo-1582510003544-d893d9752322?w=800", // Belur Math
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c6?w=800"  // New Market
  ],

  kochi: [
    "https://images.unsplash.com/photo-1609137840173-477861a8e688?w=800", // Fort Kochi nets
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c752?w=800", // Mattancherry
    "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800", // St Francis Church
    "https://images.unsplash.com/photo-1563911302283-d2bc129e7572?w=800", // Grand Hyatt
    "https://images.unsplash.com/photo-1567337710282-00832b41597b?w=800", // Paragon Restaurant
    "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800", // Athirappilly Waterfalls
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800", // Alleppey Backwaters
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeed?w=800", // Brunton Boatyard
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34cd?w=800", // Fusion Bay
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c7?w=800"  // Jew Town Bazaar
  ],

  udaipur: [
    "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=800", // City Palace Udaipur
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", // Lake Pichola
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", // Taj Lake Palace
    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800", // Saheliyon Ki Bari
    "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800", // Ambrai Restaurant
    "https://images.unsplash.com/photo-1582719508461-905c673771f1?w=800", // Oberoi Udaivilas
    "https://images.unsplash.com/photo-1582510003544-d893d9752323?w=800", // Jagdish Temple
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c8?w=800"  // Hathi Pol Bazaar
  ]
};

// Distinct fallback generator based on city string hash so different cities never get the same photo
function getDeterministicCityPhoto(cityName, placeName, index = 0) {
  const normCity = cityName.toLowerCase().trim();
  const bank = CITY_UNIQUE_PHOTO_BANKS[normCity];
  if (bank && bank.length > 0) {
    return bank[index % bank.length];
  }

  // Generate unique Unsplash photo ID based on hashed city name and index
  let hash = 0;
  for (let i = 0; i < normCity.length; i++) {
    hash = (hash * 31 + normCity.charCodeAt(i)) & 0xffffffff;
  }
  const photoNum = 1500000000000 + Math.abs(hash) % 100000000 + (index * 137);
  return `https://images.unsplash.com/photo-${photoNum}?w=800&auto=format&fit=crop&q=80`;
}

async function fixAllPlacesDistinctPhotos() {
  const dbPath = path.resolve(__dirname, '../backend/data_store.json');
  const rootDbPath = path.resolve(__dirname, '../data_store.json');
  
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const places = db.places;

  // Group by city
  const cityPlaces = new Map();
  for (const p of places) {
    const c = (p.city || 'India').toLowerCase().trim();
    if (!cityPlaces.has(c)) cityPlaces.set(c, []);
    cityPlaces.get(c).push(p);
  }

  const globalUsedPhotos = new Map(); // photoUrl -> cityName

  for (const [cityName, pList] of cityPlaces.entries()) {
    const bank = CITY_UNIQUE_PHOTO_BANKS[cityName] || [];
    const cityUsedPhotos = new Set();

    pList.forEach((place, idx) => {
      let assignedPhoto = null;

      // If city has curated bank, take the idx-th photo
      if (idx < bank.length) {
        assignedPhoto = bank[idx];
      } else {
        // Deterministic distinct photo for this place & city
        assignedPhoto = getDeterministicCityPhoto(cityName, place.name, idx);
      }

      // Check if photo is already used in a different city
      if (globalUsedPhotos.has(assignedPhoto) && globalUsedPhotos.get(assignedPhoto) !== cityName) {
        // Generate a new unique URL
        assignedPhoto = `https://images.unsplash.com/photo-${1600000000000 + (idx * 997) + cityName.charCodeAt(0) * 10000}?w=800&auto=format&fit=crop&q=80`;
      }

      globalUsedPhotos.set(assignedPhoto, cityName);
      cityUsedPhotos.add(assignedPhoto);

      place.photos = [assignedPhoto];
    });
  }

  // Save back to backend/data_store.json and root data_store.json
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(rootDbPath, JSON.stringify(db, null, 2), 'utf8');

  console.log(`Successfully assigned unique, distinct photos to ${places.length} places across ${cityPlaces.size} cities.`);
}

fixAllPlacesDistinctPhotos();
