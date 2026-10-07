import { CityInfo, Place, TravelTip, LatLng } from "./types";

export const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23e2e8f0'/><g transform='translate(330, 220)'><path d='M50 0 L100 80 L0 80 Z' fill='%23cbd5e1'/><path d='M70 20 L120 80 L20 80 Z' fill='%2394a3b8' opacity='0.7'/><circle cx='30' cy='20' r='10' fill='%23f59e0b'/></g><text x='50%' y='60%' font-family='sans-serif' font-size='18' fill='%2364748b' text-anchor='middle' font-weight='bold'>Image Preview</text></svg>";

export const FALLBACK_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23cbd5e1'/><path d='M50 20 A 15 15 0 1 1 50 50 A 15 15 0 1 1 50 20 Z M 15 80 Q 50 55 85 80 Z' fill='%2364748b'/></svg>";

export const DEFAULT_CITIES: CityInfo[] = [
  {
    name: "Hyderabad",
    state: "Telangana",
    description: "The City of Pearls, famous for its rich Nizami heritage, iconic Charminar, Golconda Fort, and world-renowned Biryani.",
    image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600&auto=format&fit=crop&q=80",
    lat: 17.3850,
    lng: 78.4867
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    description: "The Garden City and Silicon Valley of India, known for lush parks, vibrant breweries, and pleasant year-round climate.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    name: "Goa",
    state: "Goa",
    description: "India's beach paradise, renowned for pristine shores, Portuguese colonial architecture, seafood shacks, and nightlife.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
    lat: 15.2993,
    lng: 74.1240
  },
  {
    name: "Delhi",
    state: "Delhi",
    description: "India's vibrant capital, where centuries-old Mughal monuments, bustling street markets, and modern avenues meet.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80",
    lat: 28.6139,
    lng: 77.2090
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    description: "The City of Dreams, home to the Gateway of India, Marine Drive, Bollywood glamour, and pulsating coastal energy.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80",
    lat: 19.0760,
    lng: 72.8777
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    description: "The Pink City, celebrated for its majestic Hawa Mahal, Amer Fort, royal palaces, and rich Rajasthani craftsmanship.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80",
    lat: 26.9124,
    lng: 75.7873
  },
  {
    name: "Puttaparthi",
    state: "Andhra Pradesh",
    description: "A tranquil spiritual township on the banks of Chitravathi river, home to the peaceful Prasanthi Nilayam ashram.",
    image: "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
    lat: 14.1670,
    lng: 77.8118
  }
];

export const DEFAULT_TIPS: TravelTip[] = [
  {
    id: "tip-1",
    title: "Discover India's Street Food Safely",
    category: "food",
    text: "Seek out busy street stalls popular with local families. Freshly cooked hot items like dosas, samosas, and chai offer authentic flavors safely.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
  },
  {
    id: "tip-2",
    title: "Best Season to Visit the Coast",
    category: "culture",
    text: "Coastal regions such as Goa, Kerala, and Mumbai are best experienced between October and March when the weather is cool and dry.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
  },
  {
    id: "tip-3",
    title: "Heritage Havelis & Homestays",
    category: "budget",
    text: "Choose authentic heritage stays in Rajasthan or Kerala backwaters for an immersive historical experience with warm local hospitality.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
  }
];

export const DEFAULT_HOTELS: Place[] = [
  {
    id: "hotel-taj-lake",
    name: "Taj Lake Palace, Udaipur",
    type: "hotel",
    subtypes: ["Heritage Luxury", "Palace Stay"],
    rating: 4.9,
    reviewCount: 1840,
    priceLevel: 4,
    priceRange: "₹35,000 - ₹75,000 / night",
    address: "Pichola, Udaipur, Rajasthan 313001",
    description: "Floating like a jewel on Lake Pichola, this 18th-century marble palace offers royal butler service and panoramic lake views.",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
    ],
    facilities: ["Lake View", "Swimming Pool", "Spa & Wellness", "Fine Dining", "Free WiFi"],
    coordinates: { lat: 24.5754, lng: 73.6800 },
    city: "Udaipur",
    state: "Rajasthan"
  },
  {
    id: "hotel-oberoi-amarvilas",
    name: "The Oberoi Amarvilas, Agra",
    type: "hotel",
    subtypes: ["Luxury Resort", "Taj View"],
    rating: 4.9,
    reviewCount: 2150,
    priceLevel: 4,
    priceRange: "₹30,000 - ₹60,000 / night",
    address: "Taj East Gate Rd, Paktola, Tajganj, Agra, Uttar Pradesh 282001",
    description: "Located just 600 meters from the Taj Mahal, with uninterrupted monument views from every room and tranquil Mughal gardens.",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
    ],
    facilities: ["Monument View", "Mughal Spa", "Fine Dining", "Infinity Pool", "Butler Service"],
    coordinates: { lat: 27.1700, lng: 78.0460 },
    city: "Agra",
    state: "Uttar Pradesh"
  },
  {
    id: "hotel-itc-grand-chola",
    name: "ITC Grand Chola, Chennai",
    type: "hotel",
    subtypes: ["Luxury Hotel", "Chola Architecture"],
    rating: 4.8,
    reviewCount: 3200,
    priceLevel: 4,
    priceRange: "₹12,000 - ₹25,000 / night",
    address: "63 Anna Salai, Guindy, Chennai, Tamil Nadu 600032",
    description: "An architectural tribute to Southern India's golden Chola dynasty, offering palatial carved marble pillars and award-winning dining.",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
    ],
    facilities: ["10 Restaurants", "Luxury Spa", "Three Pools", "Helipad", "Valet Parking"],
    coordinates: { lat: 13.0105, lng: 80.2157 },
    city: "Chennai",
    state: "Tamil Nadu"
  }
];

// Offline & Instant Client-Side Discovery Engine
export function generateClientDiscovery(query: string, preCoords?: LatLng | null): { city: CityInfo; places: Place[]; suggestedTab: string } {
  const clean = query.trim();
  const lower = clean.toLowerCase();
  
  // 1. Check known cities
  const matched = DEFAULT_CITIES.find(c => c.name.toLowerCase() === lower || lower.includes(c.name.toLowerCase()));
  
  const cityName = matched ? matched.name : clean.charAt(0).toUpperCase() + clean.slice(1);
  const state = matched ? matched.state : "India";
  const lat = preCoords?.lat || matched?.lat || (14.0 + Math.random() * 14.0);
  const lng = preCoords?.lng || matched?.lng || (74.0 + Math.random() * 12.0);
  
  const cityInfo: CityInfo = {
    name: cityName,
    state: state,
    lat: lat,
    lng: lng,
    image: matched?.image || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200",
    description: matched?.description || `Discover the vibrant sights, cultural heritage, authentic cuisine, and relaxing stays in ${cityName}, ${state}.`
  };

  const samplePlaces: Place[] = [
    {
      id: `p-${lower}-1`,
      name: `${cityName} Heritage Landmark & Museum`,
      type: "attraction",
      subtypes: ["Historic Monument", "Cultural Sight"],
      rating: 4.8,
      reviewCount: 342,
      priceLevel: 1,
      priceRange: "₹50 - ₹200 entry",
      address: `Main Heritage Boulevard, ${cityName}`,
      description: `A celebrated historical site in ${cityName} highlighting rich architecture, local traditions, and centuries of preserved culture.`,
      photos: [
        "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800"
      ],
      facilities: ["Guided Tours", "Photography Allowed", "Souvenir Shop", "Wheelchair Accessible"],
      coordinates: { lat: lat + 0.005, lng: lng + 0.004 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-2`,
      name: `The Royal Palace Resort & Spa`,
      type: "hotel",
      subtypes: ["Luxury Resort", "Boutique Hotel"],
      rating: 4.7,
      reviewCount: 521,
      priceLevel: 3,
      priceRange: "₹4,500 - ₹9,000 / night",
      address: `Resort Enclave, Near Lake View, ${cityName}`,
      description: `Premium resort featuring spacious suites, lush landscaped courtyards, authentic regional dining, and tranquil spa therapies.`,
      photos: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
      ],
      facilities: ["Swimming Pool", "Complimentary Breakfast", "Free High-Speed WiFi", "Spa", "24/7 Room Service"],
      coordinates: { lat: lat - 0.006, lng: lng + 0.005 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-3`,
      name: `${cityName} Traditional Spice Kitchen`,
      type: "restaurant",
      subtypes: ["Fine Dining", "Authentic Regional Cuisine"],
      rating: 4.6,
      reviewCount: 890,
      priceLevel: 2,
      priceRange: "₹400 - ₹900 for two",
      address: `Market Square, ${cityName}`,
      description: `Beloved local culinary establishment renowned for fragrant thalis, wood-fired tandoor specialties, and warm traditional hospitality.`,
      photos: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800"
      ],
      facilities: ["Vegetarian Options", "Air Conditioned", "Takeaway Available", "Family Seating"],
      coordinates: { lat: lat + 0.003, lng: lng - 0.005 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-4`,
      name: `Ancient Temple of Peace & Tranquility`,
      type: "temple",
      subtypes: ["Sacred Shrine", "Spiritual Architecture"],
      rating: 4.9,
      reviewCount: 1420,
      priceLevel: 1,
      priceRange: "Free Admission",
      address: `Temple Road, ${cityName}`,
      description: `An ancient sacred sanctuary revered for intricate stone carvings, divine peace, and uplifting spiritual rituals.`,
      photos: [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800"
      ],
      facilities: ["Shoe Keeping Counter", "Prasadam Hall", "Peaceful Meditation Zone"],
      coordinates: { lat: lat - 0.004, lng: lng - 0.003 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-5`,
      name: `Grand Central Comfort Inn`,
      type: "hotel",
      subtypes: ["Business Hotel", "Comfort Stay"],
      rating: 4.5,
      reviewCount: 310,
      priceLevel: 2,
      priceRange: "₹2,200 - ₹4,500 / night",
      address: `Station Approach Road, ${cityName}`,
      description: `Convenient modern hotel offering comfortable rooms, speedy WiFi, multi-cuisine restaurant, and express check-in.`,
      photos: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
      ],
      facilities: ["Free WiFi", "Power Backup", "Conference Room", "Restaurant"],
      coordinates: { lat: lat + 0.008, lng: lng - 0.002 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-6`,
      name: `Chai & Chaat Cafe Corner`,
      type: "cafe",
      subtypes: ["Street Snacks", "Cafe & Bakery"],
      rating: 4.7,
      reviewCount: 412,
      priceLevel: 1,
      priceRange: "₹150 - ₹350 for two",
      address: `Old Bazaar Lane, ${cityName}`,
      description: `Vibrant evening gathering hub serving artisanal ginger masala chai, crispy street snacks, and freshly prepared sweets.`,
      photos: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800"
      ],
      facilities: ["Outdoor Seating", "Quick Bites", "Specialty Chai"],
      coordinates: { lat: lat - 0.002, lng: lng + 0.007 },
      city: cityName,
      state: state
    }
  ];

  return {
    city: cityInfo,
    places: samplePlaces,
    suggestedTab: "all"
  };
}
