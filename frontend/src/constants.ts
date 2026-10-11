import { CityInfo, Place, TravelTip, LatLng } from "./types";

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800&auto=format&fit=crop&q=80";

export const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";

export const DEFAULT_CITIES: CityInfo[] = [
  {
    name: "Hyderabad",
    state: "Telangana",
    description: "The City of Pearls, famous for its rich Nizami heritage, iconic Charminar, Golconda Fort, and world-renowned Biryani.",
    image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800&auto=format&fit=crop&q=80",
    lat: 17.3850,
    lng: 78.4867
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    description: "The Cultural Capital of South India, famous for Marina Beach, ancient Dravidian temples, and traditional filter coffee.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    lat: 13.0827,
    lng: 80.2707
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    description: "The Garden City and Silicon Valley of India, known for lush parks, vibrant breweries, and pleasant year-round climate.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    description: "The City of Dreams, home to the Gateway of India, Marine Drive, Bollywood glamour, and pulsating coastal energy.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80",
    lat: 19.0760,
    lng: 72.8777
  },
  {
    name: "Delhi",
    state: "Delhi",
    description: "India's vibrant capital, where centuries-old Mughal monuments, bustling street markets, and modern avenues meet.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
    lat: 28.6139,
    lng: 77.2090
  },
  {
    name: "Goa",
    state: "Goa",
    description: "India's beach paradise, renowned for pristine shores, Portuguese colonial architecture, seafood shacks, and nightlife.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    lat: 15.2993,
    lng: 74.1240
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    description: "The Pink City, celebrated for its majestic Hawa Mahal, Amer Fort, royal palaces, and rich Rajasthani craftsmanship.",
    image: "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800&auto=format&fit=crop&q=80",
    lat: 26.9124,
    lng: 75.7873
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
    id: "hotel-taj-falaknuma",
    name: "Taj Falaknuma Palace, Hyderabad",
    type: "hotel",
    subtypes: ["Heritage Luxury", "Palace Stay"],
    rating: 4.9,
    reviewCount: 1680,
    priceLevel: 4,
    priceRange: "₹38,000 - ₹85,000 / night",
    address: "Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad, Telangana 500053",
    description: "Former palace of the Nizam perched 2,000 feet above Hyderabad, with Venetian chandeliers and royal horse carriage arrivals.",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    facilities: ["Palace Gardens", "Swimming Pool", "Jiva Spa", "Royal Dining", "Free WiFi"],
    coordinates: { lat: 17.3314, lng: 78.4674 },
    city: "Hyderabad",
    state: "Telangana"
  },
  {
    id: "hotel-taj-mahal-palace",
    name: "The Taj Mahal Palace, Mumbai",
    type: "hotel",
    subtypes: ["Harbor Luxury", "Heritage Landmark"],
    rating: 4.9,
    reviewCount: 3800,
    priceLevel: 4,
    priceRange: "₹30,000 - ₹75,000 / night",
    address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001",
    description: "India's most iconic luxury hotel overlooking the Gateway of India and the Arabian Sea, featuring Michelin-level dining.",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    facilities: ["Harbor View", "Sea Lounge", "Jiva Spa", "Swimming Pool", "Butler Service"],
    coordinates: { lat: 18.9217, lng: 72.8332 },
    city: "Mumbai",
    state: "Maharashtra"
  },
  {
    id: "hotel-leela-palace",
    name: "The Leela Palace Bangalore",
    type: "hotel",
    subtypes: ["Royal Palace Hotel", "Luxury Gardens"],
    rating: 4.9,
    reviewCount: 2100,
    priceLevel: 4,
    priceRange: "₹24,000 - ₹55,000 / night",
    address: "23, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008",
    description: "Palatial hotel inspired by the architecture of Mysore Palace, featuring gilded archways, lush courtyards, and world-class spas.",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
    ],
    facilities: ["Ayurvedic Spa", "Heated Pool", "Fine Dining", "Free WiFi", "Valet Parking"],
    coordinates: { lat: 12.9606, lng: 77.6484 },
    city: "Bangalore",
    state: "Karnataka"
  }
];

// Offline & Instant Client-Side Discovery Engine with Guaranteed Photo Uniqueness
export function generateClientDiscovery(
  query: string,
  preCoords?: LatLng | null
): { city: CityInfo; places: Place[]; suggestedTab: string } {
  const clean = query.trim();
  const lower = clean.toLowerCase();

  const matched = DEFAULT_CITIES.find(
    c => c.name.toLowerCase() === lower || lower.includes(c.name.toLowerCase())
  );

  const cityName = matched ? matched.name : clean.charAt(0).toUpperCase() + clean.slice(1);
  const state = matched ? matched.state : "India";
  const lat = preCoords?.lat || matched?.lat || (17.0 + (cityName.charCodeAt(0) % 10));
  const lng = preCoords?.lng || matched?.lng || (77.0 + (cityName.charCodeAt(1) % 6));

  const cityInfo: CityInfo = {
    name: cityName,
    state: state,
    lat: lat,
    lng: lng,
    image: matched?.image || "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=1200",
    description:
      matched?.description ||
      `Discover the vibrant sights, cultural heritage, authentic cuisine, and relaxing stays in ${cityName}, ${state}.`
  };

  const samplePlaces: Place[] = [
    {
      id: `p-${lower}-1`,
      name: `${cityName} Heritage Fort & Museum`,
      type: "attraction",
      subtypes: ["Historic Monument", "Cultural Sight"],
      rating: 4.8,
      reviewCount: 342,
      priceLevel: 1,
      priceRange: "₹50 entry",
      address: `Historic Quarter, ${cityName}, ${state}`,
      description: `A celebrated historical site in ${cityName} highlighting rich architecture, local traditions, and centuries of preserved culture.`,
      photos: [
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
        "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800"
      ],
      facilities: ["Guided Tours", "Photography Allowed", "Souvenir Shop", "Wheelchair Accessible"],
      coordinates: { lat: lat + 0.005, lng: lng + 0.004 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-2`,
      name: `${cityName} Grand Palace Resort & Spa`,
      type: "hotel",
      subtypes: ["Luxury Resort", "Boutique Hotel"],
      rating: 4.7,
      reviewCount: 521,
      priceLevel: 3,
      priceRange: "₹4,500 - ₹9,000 / night",
      address: `Resort Enclave, Near Scenic Lake, ${cityName}, ${state}`,
      description: `Premium resort featuring spacious suites, lush landscaped courtyards, authentic regional dining, and tranquil spa therapies.`,
      photos: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
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
      address: `Market Square, ${cityName}, ${state}`,
      description: `Beloved local culinary establishment renowned for fragrant thalis, wood-fired tandoor specialties, and warm traditional hospitality.`,
      photos: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
      ],
      facilities: ["Vegetarian Options", "Air Conditioned", "Takeaway Available", "Family Seating"],
      coordinates: { lat: lat + 0.003, lng: lng - 0.005 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-4`,
      name: `Ancient Temple of Divine Peace`,
      type: "temple",
      subtypes: ["Sacred Shrine", "Spiritual Architecture"],
      rating: 4.9,
      reviewCount: 1420,
      priceLevel: 1,
      priceRange: "Free Admission",
      address: `Temple Road, ${cityName}, ${state}`,
      description: `An ancient sacred sanctuary revered for intricate stone carvings, divine peace, and uplifting spiritual rituals.`,
      photos: [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"
      ],
      facilities: ["Shoe Keeping Counter", "Prasadam Hall", "Peaceful Meditation Zone"],
      coordinates: { lat: lat - 0.004, lng: lng - 0.003 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-5`,
      name: `Grand Central Comfort Residency`,
      type: "hotel",
      subtypes: ["Business Hotel", "Comfort Stay"],
      rating: 4.5,
      reviewCount: 310,
      priceLevel: 2,
      priceRange: "₹2,200 - ₹4,500 / night",
      address: `Station Approach Road, ${cityName}, ${state}`,
      description: `Convenient modern hotel offering comfortable rooms, speedy WiFi, multi-cuisine restaurant, and express check-in.`,
      photos: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
      ],
      facilities: ["Free WiFi", "Power Backup", "Conference Room", "Restaurant"],
      coordinates: { lat: lat + 0.008, lng: lng - 0.002 },
      city: cityName,
      state: state
    },
    {
      id: `p-${lower}-6`,
      name: `Chai & Street Food Corner`,
      type: "cafe",
      subtypes: ["Street Snacks", "Cafe & Bakery"],
      rating: 4.7,
      reviewCount: 412,
      priceLevel: 1,
      priceRange: "₹150 - ₹350 for two",
      address: `Old Bazaar Lane, ${cityName}, ${state}`,
      description: `Vibrant evening gathering hub serving artisanal ginger masala chai, crispy street snacks, and freshly prepared sweets.`,
      photos: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800"
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
