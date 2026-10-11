const fs = require('fs');

// 1. Add kolkata, kochi, udaipur to CITY_LANDMARK_REGISTRY in imageService.ts
let imageServiceSrc = fs.readFileSync('backend/src/services/imageService.ts', 'utf8');

const additionalRegistries = `
  kolkata: {
    hero: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&auto=format&fit=crop&q=80", // Howrah Bridge
    landmarks: {
      "victoria memorial": [
        "https://images.unsplash.com/photo-1608463123864-dd0e2946c0a0?w=800&auto=format&fit=crop&q=80"
      ],
      "howrah bridge": [
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80"
      ],
      "dakshineswar kali temple": [
        "https://images.unsplash.com/photo-1627993078496-e2600ff51efd?w=800&auto=format&fit=crop&q=80"
      ],
      "indian museum": [
        "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80"
      ],
      "the oberoi grand": [
        "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=800&auto=format&fit=crop&q=80"
      ],
      "peter cat": [
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80"
    ],
    stays: [
      "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1608463123864-dd0e2946c0a0?w=800&auto=format&fit=crop&q=80"
    ]
  },

  kochi: {
    hero: "https://images.unsplash.com/photo-1609137840173-477861a8e688?w=1600&auto=format&fit=crop&q=80", // Kerala Palms & Waters
    landmarks: {
      "fort kochi": [
        "https://images.unsplash.com/photo-1593693475878-362cb9666fc2?w=800&auto=format&fit=crop&q=80"
      ],
      "chinese fishing nets": [
        "https://images.unsplash.com/photo-1593693475878-362cb9666fc2?w=800&auto=format&fit=crop&q=80"
      ],
      "mattancherry palace": [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80"
      ],
      "st francis church": [
        "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800&auto=format&fit=crop&q=80"
      ],
      "grand hyatt kochi bolgatty": [
        "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&auto=format&fit=crop&q=80"
      ],
      "paragon restaurant": [
        "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop&q=80"
    ],
    stays: [
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1609137840173-477861a8e688?w=800&auto=format&fit=crop&q=80"
    ]
  },

  udaipur: {
    hero: "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=1600&auto=format&fit=crop&q=80", // Udaipur Lake Palace
    landmarks: {
      "city palace udaipur": [
        "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=800&auto=format&fit=crop&q=80"
      ],
      "lake pichola": [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80"
      ],
      "taj lake palace": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
      ],
      "saheliyon ki bari": [
        "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80"
      ],
      "ambrai waterfront restaurant": [
        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&auto=format&fit=crop&q=80"
    ],
    stays: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=800&auto=format&fit=crop&q=80"
    ]
  }
`;

// Insert before the closing brace of CITY_LANDMARK_REGISTRY
const endOfRegistryMarker = '  tirupati: {';
const tirupatiIdx = imageServiceSrc.indexOf(endOfRegistryMarker);
if (tirupatiIdx !== -1) {
  const insertPoint = imageServiceSrc.indexOf('  }\n};', tirupatiIdx) + '  }'.length;
  imageServiceSrc = imageServiceSrc.slice(0, insertPoint) + ',\n' + additionalRegistries + imageServiceSrc.slice(insertPoint);
  fs.writeFileSync('backend/src/services/imageService.ts', imageServiceSrc, 'utf8');
  console.log('Successfully added kolkata, kochi, udaipur to CITY_LANDMARK_REGISTRY!');
}

// 2. Add aliases in imageService.ts
imageServiceSrc = fs.readFileSync('backend/src/services/imageService.ts', 'utf8');
const aliasMarker = '"chennai": "chennai",';
if (!imageServiceSrc.includes('"kolkata": "kolkata"')) {
  imageServiceSrc = imageServiceSrc.replace(
    aliasMarker,
    `"chennai": "chennai",\n  "kolkata": "kolkata",\n  "calcutta": "kolkata",\n  "kochi": "kochi",\n  "cochin": "kochi",\n  "kerala": "kochi",\n  "udaipur": "udaipur",`
  );
  fs.writeFileSync('backend/src/services/imageService.ts', imageServiceSrc, 'utf8');
  console.log('Added city aliases for kolkata, kochi, udaipur!');
}

// 3. Now append curated places for varanasi, amritsar, kolkata, kochi, udaipur to curatedCatalog.ts
let curatedSrc = fs.readFileSync('backend/src/services/curatedCatalog.ts', 'utf8');

const newCuratedCities = `
  varanasi: {
    aliases: ["varanasi", "kashi", "banaras"],
    city: {
      name: "Varanasi",
      state: "Uttar Pradesh",
      lat: 25.3176,
      lng: 82.9739,
      image: CITY_LANDMARK_REGISTRY.varanasi.hero,
      description: "One of the oldest continuously inhabited cities in the world, the spiritual heart of India along the sacred banks of the Ganges."
    },
    places: [
      {
        id: "p-vns-1",
        name: "Dashashwamedh Ghat & Evening Ganga Aarti",
        type: "attraction",
        subtypes: ["Sacred Riverfront", "Spiritual Aarti"],
        rating: 4.9,
        reviewCount: 7800,
        priceLevel: 1,
        priceRange: "Free Public Access",
        address: "Dashashwamedh Ghat Rd, Bangali Tola, Varanasi, Uttar Pradesh 221001",
        description: "The main and most spectacular river ghat on the Ganges, famous for the magnificent choreographed evening Maha Aarti ritual performed with tiered brass lamps.",
        photos: [
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["dashashwamedh ghat"][0],
          CITY_LANDMARK_REGISTRY.varanasi.culture[0]
        ],
        facilities: ["Ganga Aarti Viewing", "Sunrise Boating", "Priest Blessing Steps", "Riverfront Promenade"],
        coordinates: { lat: 25.3065, lng: 83.0105 },
        city: "Varanasi",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-vns-2",
        name: "Kashi Vishwanath Temple (Golden Temple)",
        type: "temple",
        subtypes: ["Jyotirlinga Shrine", "Shiva Temple"],
        rating: 4.9,
        reviewCount: 8200,
        priceLevel: 1,
        priceRange: "Free Darshan",
        address: "Lahori Tola, Varanasi, Uttar Pradesh 221001",
        description: "One of the twelve holy Jyotirlingas of Lord Shiva, crowned with an iconic 800-kg gold spire and newly connected to the sacred Ganges by the Vishwanath Corridor.",
        photos: [
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["kashi vishwanath"][0],
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["dashashwamedh ghat"][0]
        ],
        facilities: ["Corridor Walkway", "Locker Facility", "VIP Sugam Darshan", "Prasadam Counter"],
        coordinates: { lat: 25.3109, lng: 83.0107 },
        city: "Varanasi",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-vns-3",
        name: "Assi Ghat & Subah-e-Banaras",
        type: "attraction",
        subtypes: ["Southern Ghat", "Cultural Performance"],
        rating: 4.8,
        reviewCount: 4100,
        priceLevel: 1,
        priceRange: "Free Public Access",
        address: "Assi Ghat, Shivala, Varanasi, Uttar Pradesh 221005",
        description: "Vibrant southernmost ghat where the Assi river meets the Ganges, renowned for morning yoga, classical music recitals at dawn, and relaxing riverfront cafes.",
        photos: [
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["assi ghat"][0],
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["dashashwamedh ghat"][0]
        ],
        facilities: ["Subah-e-Banaras Dawn Concerts", "Morning Yoga", "Boat Hire", "Rooftop Cafes"],
        coordinates: { lat: 25.2885, lng: 83.0062 },
        city: "Varanasi",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-vns-4",
        name: "Sarnath Buddhist Pilgrimage & Dhamek Stupa",
        type: "attraction",
        subtypes: ["Buddhist Pilgrimage", "Ancient Ruins"],
        rating: 4.8,
        reviewCount: 3600,
        priceLevel: 1,
        priceRange: "₹25 Entry Ticket",
        address: "Sarnath, Varanasi, Uttar Pradesh 221007",
        description: "The sacred deer park where Gautama Buddha delivered his first sermon after attaining enlightenment, featuring the ancient 43-meter Dhamek Stupa and Ashoka Lion Capital.",
        photos: [
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["sarnath"][0],
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["assi ghat"][0]
        ],
        facilities: ["Archaeological Museum", "Ashoka Pillar Ruins", "Deer Park", "Peace Gardens"],
        coordinates: { lat: 25.3811, lng: 83.0214 },
        city: "Varanasi",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-vns-5",
        name: "BrijRama Palace Heritage Grand Hotel",
        type: "hotel",
        subtypes: ["18th Century Palace", "Luxury Heritage"],
        rating: 4.9,
        reviewCount: 1950,
        priceLevel: 4,
        priceRange: "₹22,000 - ₹50,000 / night",
        address: "Darbhanga Ghat, Dashashwamedh, Varanasi, Uttar Pradesh 221001",
        description: "One of the oldest architectural jewels on the Varanasi riverfront, built in 1812 by the royal house of Nagpur with heritage elevator, sitar recitals, and private ghat access.",
        photos: [
          CITY_LANDMARK_REGISTRY.varanasi.landmarks["brijrama palace"][0],
          CITY_LANDMARK_REGISTRY.varanasi.stays[0]
        ],
        facilities: ["Private Boat Arrival", "Chhau & Classical Music", "Darbhanga Fine Dining", "Panoramic River Views"],
        coordinates: { lat: 25.3050, lng: 83.0101 },
        city: "Varanasi",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-vns-6",
        name: "Kashi Chat Bhandar & Banarasi Street Delicacies",
        type: "restaurant",
        subtypes: ["Traditional Chaat", "Iconic Street Food"],
        rating: 4.7,
        reviewCount: 4600,
        priceLevel: 1,
        priceRange: "₹150 - ₹350 for two",
        address: "D.37/49, Godowlia Rd, Near Dashashwamedh Ghat, Varanasi, Uttar Pradesh 221001",
        description: "World-renowned street food institution legendary for warm Tamatar Chaat served in earthen kulhads, Palak Patta Chaat, Dahi Puri, and sweet Malaiyo.",
        photos: [
          CITY_LANDMARK_REGISTRY.varanasi.food[0],
          CITY_LANDMARK_REGISTRY.varanasi.food[0]
        ],
        facilities: ["Earthen Kulhad Serving", "Authentic Tamatar Chaat", "Quick Counter Service", "Local Sweets"],
        coordinates: { lat: 25.3090, lng: 83.0075 },
        city: "Varanasi",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: false
      }
    ]
  },

  amritsar: {
    aliases: ["amritsar", "golden temple city"],
    city: {
      name: "Amritsar",
      state: "Punjab",
      lat: 31.6340,
      lng: 74.8723,
      image: CITY_LANDMARK_REGISTRY.amritsar.hero,
      description: "The spiritual and cultural center of the Sikh religion, world-famous for the gilded Golden Temple and heartwarming Punjabi hospitality."
    },
    places: [
      {
        id: "p-asr-1",
        name: "Sri Harmandir Sahib (The Golden Temple)",
        type: "temple",
        subtypes: ["Sikh Gurdwara", "Spiritual Sanctum"],
        rating: 4.9,
        reviewCount: 9900,
        priceLevel: 1,
        priceRange: "Free Admission (Langar Open to All)",
        address: "Golden Temple Rd, Atta Mandi, Katra Ahluwalia, Amritsar, Punjab 143006",
        description: "The holiest Gurdwara of Sikhism, plated with real gold leaf and surrounded by the sacred Amrit Sarovar lake, serving free langar meals to over 100,000 visitors every day.",
        photos: [
          CITY_LANDMARK_REGISTRY.amritsar.landmarks["golden temple"][0],
          CITY_LANDMARK_REGISTRY.amritsar.culture[0]
        ],
        facilities: ["Community Langar Kitchen", "Sacred Amrit Sarovar", "Head Cover Counters", "24/7 Spiritual Kirtan"],
        coordinates: { lat: 31.6200, lng: 74.8765 },
        city: "Amritsar",
        state: "Punjab",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-asr-2",
        name: "Jallianwala Bagh Memorial Garden",
        type: "attraction",
        subtypes: ["Historic Memorial", "National Heritage"],
        rating: 4.7,
        reviewCount: 5200,
        priceLevel: 1,
        priceRange: "Free Public Admission",
        address: "Golden Temple Rd, Amritsar, Punjab 143006",
        description: "Historic public garden and memorial of national importance honoring the martyrs of the 1919 massacre, featuring bullet-marked walls and the historic Martyrs' Well.",
        photos: [
          CITY_LANDMARK_REGISTRY.amritsar.landmarks["jallianwala bagh"][0],
          CITY_LANDMARK_REGISTRY.amritsar.landmarks["golden temple"][0]
        ],
        facilities: ["Eternal Flame Memorial", "Bullet Mark Walls", "Martyrs' Well", "Light & Sound Show"],
        coordinates: { lat: 31.6206, lng: 74.8801 },
        city: "Amritsar",
        state: "Punjab",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-asr-3",
        name: "Wagah Border Beating Retreat Ceremony",
        type: "attraction",
        subtypes: ["Military Pageantry", "International Border"],
        rating: 4.8,
        reviewCount: 6300,
        priceLevel: 1,
        priceRange: "Free Admission (Security Check Required)",
        address: "Grand Trunk Rd, Wagah, Hardo Rattan, Punjab 143108",
        description: "Spectacular daily military parade and flag-lowering ceremony conducted by the Border Security Force and Pakistan Rangers with synchronized high kicks and patriotic fervor.",
        photos: [
          CITY_LANDMARK_REGISTRY.amritsar.landmarks["wagah border"][0],
          CITY_LANDMARK_REGISTRY.amritsar.landmarks["golden temple"][0]
        ],
        facilities: ["Grandstand Stadium Seating", "Patriotic Parade", "Security Screening", "Border Gate View"],
        coordinates: { lat: 31.6047, lng: 74.5731 },
        city: "Amritsar",
        state: "Punjab",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-asr-4",
        name: "Kesar Da Dhaba Historic Punjabi Kitchen",
        type: "restaurant",
        subtypes: ["Authentic Punjabi", "Historic Dhaba"],
        rating: 4.7,
        reviewCount: 4900,
        priceLevel: 1,
        priceRange: "₹350 - ₹700 for two",
        address: "Chowk Passian, Near Telephone Exchange, Amritsar, Punjab 143001",
        description: "Legendary dhaba operating since 1916, internationally famed for its 12-hour slow-cooked Maah Ki Dal in pure desi ghee, flaky lachha parathas, and rich malai phirni.",
        photos: [
          CITY_LANDMARK_REGISTRY.amritsar.food[0],
          CITY_LANDMARK_REGISTRY.amritsar.food[0]
        ],
        facilities: ["Desi Ghee Preparation", "Slow-Cooked Dal Makhani", "Tandoor Kitchen", "Phirni Dessert"],
        coordinates: { lat: 31.6245, lng: 74.8741 },
        city: "Amritsar",
        state: "Punjab",
        vegFriendly: true,
        nonVegFriendly: false
      }
    ]
  },

  kolkata: {
    aliases: ["kolkata", "calcutta", "city of joy"],
    city: {
      name: "Kolkata",
      state: "West Bengal",
      lat: 22.5726,
      lng: 88.3639,
      image: CITY_LANDMARK_REGISTRY.kolkata.hero,
      description: "The intellectual and cultural capital of India, renowned for grand colonial architecture, the Howrah Bridge, historic tramways, and rich culinary heritage."
    },
    places: [
      {
        id: "p-ccu-1",
        name: "Victoria Memorial & Gardens",
        type: "attraction",
        subtypes: ["Indo-Saracenic Marble Monument", "Museum"],
        rating: 4.8,
        reviewCount: 6400,
        priceLevel: 1,
        priceRange: "₹50 entry fee",
        address: "Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West Bengal 700071",
        description: "Opulent white Makrana marble monument constructed between 1906 and 1921, set in 64 acres of lush gardens with 25 galleries of historic British and Indian art.",
        photos: [
          CITY_LANDMARK_REGISTRY.kolkata.landmarks["victoria memorial"][0],
          CITY_LANDMARK_REGISTRY.kolkata.culture[0]
        ],
        facilities: ["Art Galleries", "Queen's Promenade Garden", "Sound & Light Show", "Carriage Rides"],
        coordinates: { lat: 22.5448, lng: 88.3426 },
        city: "Kolkata",
        state: "West Bengal",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-ccu-2",
        name: "Howrah Bridge (Rabindra Setu)",
        type: "attraction",
        subtypes: ["Cantilever Steel Bridge", "Engineering Marvel"],
        rating: 4.7,
        reviewCount: 5100,
        priceLevel: 1,
        priceRange: "Free Public Pedestrian Promenade",
        address: "Howrah Bridge, Kolkata, West Bengal 700001",
        description: "Historic balanced cantilever bridge without nuts or bolts spanning 705 meters across the Hooghly River, carrying over 100,000 vehicles and countless pedestrians daily.",
        photos: [
          CITY_LANDMARK_REGISTRY.kolkata.landmarks["howrah bridge"][0],
          CITY_LANDMARK_REGISTRY.kolkata.hero
        ],
        facilities: ["Pedestrian Walkway", "River Ferry Views", "Hooghly Riverfront", "Historic Flower Market"],
        coordinates: { lat: 22.5851, lng: 88.3468 },
        city: "Kolkata",
        state: "West Bengal",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-ccu-3",
        name: "Dakshineswar Kali Temple",
        type: "temple",
        subtypes: ["Navaratna Style", "Kali Shrine"],
        rating: 4.8,
        reviewCount: 5800,
        priceLevel: 1,
        priceRange: "Free Darshan",
        address: "Dakshineswar, Kolkata, West Bengal 700076",
        description: "19th-century temple complex situated along the eastern bank of the Hooghly River, revered as the spiritual center of mystic saint Ramakrishna Paramahamsa.",
        photos: [
          CITY_LANDMARK_REGISTRY.kolkata.landmarks["dakshineswar kali temple"][0],
          CITY_LANDMARK_REGISTRY.kolkata.landmarks["victoria memorial"][0]
        ],
        facilities: ["Riverfront Ghats", "12 Shiva Shrines", "Ramakrishna Room", "Skywalk Access"],
        coordinates: { lat: 22.6534, lng: 88.3576 },
        city: "Kolkata",
        state: "West Bengal",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-ccu-4",
        name: "The Oberoi Grand Heritage Hotel",
        type: "hotel",
        subtypes: ["Colonial Luxury Grande Dame", "Stays"],
        rating: 4.9,
        reviewCount: 2600,
        priceLevel: 4,
        priceRange: "₹16,000 - ₹38,000 / night",
        address: "15, Jawaharlal Nehru Rd, New Market Area, Dharmatala, Kolkata 700013",
        description: "Affectionately known as the Grande Dame of Chowringhee, this neo-classical luxury heritage hotel features a palm-fringed swimming pool and Michelin-caliber service.",
        photos: [
          CITY_LANDMARK_REGISTRY.kolkata.landmarks["the oberoi grand"][0],
          CITY_LANDMARK_REGISTRY.kolkata.stays[0]
        ],
        facilities: ["Courtyard Swimming Pool", "Oberoi Spa", "Baan Thai Dining", "Heritage Ballroom"],
        coordinates: { lat: 22.5601, lng: 88.3518 },
        city: "Kolkata",
        state: "West Bengal",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-ccu-5",
        name: "Peter Cat & Heritage Park Street Flavors",
        type: "restaurant",
        subtypes: ["Iconic Continental & Indian", "Park Street Institution"],
        rating: 4.7,
        reviewCount: 5400,
        priceLevel: 2,
        priceRange: "₹900 - ₹1,800 for two",
        address: "18A, Park Street, Stephen Court Building, Kolkata, West Bengal 700016",
        description: "Legendary Park Street institution established in 1975, celebrated across India for its iconic Chelo Kebab platter served with buttered rice, poached egg, and grilled tomatoes.",
        photos: [
          CITY_LANDMARK_REGISTRY.kolkata.landmarks["peter cat"][0],
          CITY_LANDMARK_REGISTRY.kolkata.food[0]
        ],
        facilities: ["Iconic Chelo Kebab", "Vintage Mood Lighting", "Air Conditioned", "Full Bar Service"],
        coordinates: { lat: 22.5532, lng: 88.3534 },
        city: "Kolkata",
        state: "West Bengal",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  kochi: {
    aliases: ["kochi", "cochin", "kerala"],
    city: {
      name: "Kochi",
      state: "Kerala",
      lat: 9.9312,
      lng: 76.2673,
      image: CITY_LANDMARK_REGISTRY.kochi.hero,
      description: "The Queen of the Arabian Sea, blending historic Portuguese spice trade quarters, Chinese fishing nets, serene backwaters, and lush coconut lagoons."
    },
    places: [
      {
        id: "p-cok-1",
        name: "Fort Kochi & Chinese Fishing Nets",
        type: "attraction",
        subtypes: ["Coastal Heritage", "Historic Fishing Nets"],
        rating: 4.7,
        reviewCount: 4600,
        priceLevel: 1,
        priceRange: "Free Shoreline Viewing",
        address: "River Road, Fort Kochi, Kochi, Kerala 682001",
        description: "Iconic shore-operated cantilevered fishing nets introduced by 14th-century Chinese traders, set against colonial Portuguese bungalows, spice warehouses, and sea breezes.",
        photos: [
          CITY_LANDMARK_REGISTRY.kochi.landmarks["fort kochi"][0],
          CITY_LANDMARK_REGISTRY.kochi.culture[0]
        ],
        facilities: ["Sunset Sea Promenade", "Art Cafes", "Fresh Fish Griddles", "Heritage Walking Tour"],
        coordinates: { lat: 9.9674, lng: 76.2429 },
        city: "Kochi",
        state: "Kerala",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-cok-2",
        name: "Mattancherry Palace (Dutch Palace)",
        type: "attraction",
        subtypes: ["Kerala Architecture", "Royal Murals"],
        rating: 4.6,
        reviewCount: 3200,
        priceLevel: 1,
        priceRange: "₹20 Entry Fee",
        address: "Palace Rd, Mattancherry, Kochi, Kerala 682002",
        description: "Built by Portuguese explorers in 1555 and renovated by the Dutch, featuring traditional Kerala wooden architecture and famous Ramayana mythological murals.",
        photos: [
          CITY_LANDMARK_REGISTRY.kochi.landmarks["mattancherry palace"][0],
          CITY_LANDMARK_REGISTRY.kochi.landmarks["fort kochi"][0]
        ],
        facilities: ["Royal Murals Gallery", "Coronation Hall", "Dutch Palanquin Display", "Jewish Town Proximity"],
        coordinates: { lat: 9.9583, lng: 76.2592 },
        city: "Kochi",
        state: "Kerala",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-cok-3",
        name: "Grand Hyatt Kochi Bolgatty",
        type: "hotel",
        subtypes: ["Waterfront Luxury Resort", "Island Stay"],
        rating: 4.9,
        reviewCount: 2200,
        priceLevel: 4,
        priceRange: "₹18,000 - ₹45,000 / night",
        address: "Mulavukad, Bolgatty Island, Kochi, Kerala 682504",
        description: "Spectacular luxury waterfront resort set on 26 acres of Bolgatty Island overlooking the Vembanad Lake backwaters, with Santata Spa and private marina boat tours.",
        photos: [
          CITY_LANDMARK_REGISTRY.kochi.landmarks["grand hyatt kochi bolgatty"][0],
          CITY_LANDMARK_REGISTRY.kochi.stays[0]
        ],
        facilities: ["Indoor & Outdoor Pools", "Santata Spa", "Private Marina", "Malabar Cafe Dining"],
        coordinates: { lat: 9.9868, lng: 76.2644 },
        city: "Kochi",
        state: "Kerala",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-cok-4",
        name: "Paragon & Authentic Malabar Flavors",
        type: "restaurant",
        subtypes: ["Kerala Seafood", "Malabar Biryani"],
        rating: 4.7,
        reviewCount: 4200,
        priceLevel: 1,
        priceRange: "₹400 - ₹800 for two",
        address: "Lulu Mall, Edappally, Kochi, Kerala 682024",
        description: "Celebrated culinary flagship revered across Kerala for fragrant Malabar chicken biryani, appam with stew, and fresh karimeen pollichathu wrapped in banana leaves.",
        photos: [
          CITY_LANDMARK_REGISTRY.kochi.landmarks["paragon restaurant"][0],
          CITY_LANDMARK_REGISTRY.kochi.food[0]
        ],
        facilities: ["Banana Leaf Specialties", "Fresh Karimeen Pollichathu", "Air Conditioned", "Malabar Biryani"],
        coordinates: { lat: 10.0270, lng: 76.3080 },
        city: "Kochi",
        state: "Kerala",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  udaipur: {
    aliases: ["udaipur", "city of lakes"],
    city: {
      name: "Udaipur",
      state: "Rajasthan",
      lat: 24.5854,
      lng: 73.7125,
      image: CITY_LANDMARK_REGISTRY.udaipur.hero,
      description: "The Venice of the East, famed for shimmering Lake Pichola, floating marble island palaces, and dramatic Aravalli mountain backdrops."
    },
    places: [
      {
        id: "p-udr-1",
        name: "City Palace Complex Udaipur",
        type: "attraction",
        subtypes: ["Royal Granite & Marble Palace", "Museum"],
        rating: 4.8,
        reviewCount: 6800,
        priceLevel: 2,
        priceRange: "₹300 entry fee",
        address: "Old City, Udaipur, Rajasthan 313001",
        description: "Rajasthan's largest royal palace complex built over 400 years atop a ridge overlooking Lake Pichola, featuring mirror mosaics, inlaid marble, and the Crystal Gallery.",
        photos: [
          CITY_LANDMARK_REGISTRY.udaipur.landmarks["city palace udaipur"][0],
          CITY_LANDMARK_REGISTRY.udaipur.culture[0]
        ],
        facilities: ["Lake Pichola Overlook", "Crystal Gallery", "Mor Chowk Peacock Court", "Boat Jetty Access"],
        coordinates: { lat: 24.5764, lng: 73.6835 },
        city: "Udaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-udr-2",
        name: "Lake Pichola & Jag Mandir Island",
        type: "attraction",
        subtypes: ["Historic Lake", "Island Palace"],
        rating: 4.8,
        reviewCount: 5400,
        priceLevel: 1,
        priceRange: "₹400 Boat Cruise",
        address: "Pichola, Udaipur, Rajasthan 313001",
        description: "Picturesque 14th-century freshwater lake surrounded by rolling hills, ghats, and royal palaces, offering sunset cruises to the 17th-century marble palace of Jag Mandir.",
        photos: [
          CITY_LANDMARK_REGISTRY.udaipur.landmarks["lake pichola"][0],
          CITY_LANDMARK_REGISTRY.udaipur.hero
        ],
        facilities: ["Sunset Boat Cruises", "Jag Mandir Island Stop", "Ghat Steps", "Lakeside Photography"],
        coordinates: { lat: 24.5700, lng: 73.6790 },
        city: "Udaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-udr-3",
        name: "Taj Lake Palace Ultra Luxury Hotel",
        type: "hotel",
        subtypes: ["Island Palace", "Iconic Luxury Stay"],
        rating: 4.9,
        reviewCount: 2900,
        priceLevel: 4,
        priceRange: "₹35,000 - ₹95,000 / night",
        address: "Pichola, Udaipur, Rajasthan 313001",
        description: "An ethereal 18th-century white marble island palace that seems to float effortlessly on the surface of Lake Pichola, offering private boat arrival and royal butler service.",
        photos: [
          CITY_LANDMARK_REGISTRY.udaipur.landmarks["taj lake palace"][0],
          CITY_LANDMARK_REGISTRY.udaipur.stays[0]
        ],
        facilities: ["Private Boat Transfer", "Jiva Spa Boat", "Lily Pond Courtyard", "Rooftop Fine Dining"],
        coordinates: { lat: 24.5756, lng: 73.6800 },
        city: "Udaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-udr-4",
        name: "Ambrai Waterfront Royal Dining",
        type: "restaurant",
        subtypes: ["Lakeside Fine Dining", "Mewari Cuisine"],
        rating: 4.7,
        reviewCount: 4100,
        priceLevel: 2,
        priceRange: "₹1,200 - ₹2,500 for two",
        address: "Amet Haveli, Ambamata Scheme - A Road, Outside Chandpole, Udaipur 313001",
        description: "Premier lakeside restaurant located at Amet Haveli on the shores of Lake Pichola, boasting unforgettable illuminated views of the City Palace and Lal Maas delicacies.",
        photos: [
          CITY_LANDMARK_REGISTRY.udaipur.landmarks["ambrai waterfront restaurant"][0],
          CITY_LANDMARK_REGISTRY.udaipur.food[0]
        ],
        facilities: ["Waterfront Tables", "Illuminated Palace Views", "Mewari Lal Maas", "Romantic Ambiance"],
        coordinates: { lat: 24.5790, lng: 73.6805 },
        city: "Udaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  }
`;

// Insert into CURATED_CITIES right before the closing brace
const curatedEndMarker = '  }\n};';
const cEndIdx = curatedSrc.lastIndexOf(curatedEndMarker);
if (cEndIdx !== -1) {
  curatedSrc = curatedSrc.slice(0, cEndIdx + 3) + ',\n' + newCuratedCities + '\n};';
  fs.writeFileSync('backend/src/services/curatedCatalog.ts', curatedSrc, 'utf8');
  console.log('Successfully appended varanasi, amritsar, kolkata, kochi, udaipur to CURATED_CITIES!');
}
