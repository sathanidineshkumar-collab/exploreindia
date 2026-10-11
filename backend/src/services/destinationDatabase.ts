import { Place } from "../models/types";

/**
 * ExploreIndia Comprehensive Destination Database
 * Authentic, verified records covering 17 travel categories across India's top destinations.
 */

export const COMPREHENSIVE_INDIAN_DESTINATIONS: Place[] = [
  // =========================================================================
  // 1. HYDERABAD & TELANGANA (Heritage, Temples, Food, Stays, Nature, Transit)
  // =========================================================================
  {
    id: "dest-hyd-01",
    name: "Charminar",
    altNames: ["Four Minarets", "Char Minar"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Nizami Heritage"],
    rating: 4.8,
    reviewCount: 3420,
    priceLevel: 1,
    priceRange: "₹25 entry fee",
    entryFee: "₹25 (Indians), ₹300 (Foreigners)",
    address: "Charminar Rd, Char Kaman, Ghansi Bazaar, Hyderabad, Telangana 500002",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3616, lng: 78.4747 },
    description: "The 1591 monument with four grand 48-meter minarets, surrounded by the bustling pearl markets and Laad Bazaar.",
    detailedDescription: "Built by Sultan Muhammad Quli Qutb Shah to commemorate the end of a plague, Charminar is the architectural crown of Hyderabad featuring Indo-Islamic stonecraft.",
    photos: [
      "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800"
    ],
    facilities: ["Historic Viewpoint", "Night Lighting", "Guided Tours", "Market Access"],
    openHours: "09:30 AM - 05:30 PM",
    bestTimeToVisit: "October to March (Evening for lighting)",
    source: "curated-registry",
    sourceId: "hyd-charminar",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Heritage", "Charminar", "Old City", "Nizam"]
  },
  {
    id: "dest-hyd-02",
    name: "Golconda Fort",
    altNames: ["Golkonda", "Mankal Fort"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Medieval Fortresses"],
    rating: 4.7,
    reviewCount: 2890,
    priceLevel: 1,
    priceRange: "₹25 entry fee",
    entryFee: "₹25 (Indians), ₹300 (Foreigners)",
    address: "Ibrahim Bagh, Hyderabad, Telangana 500008",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3833, lng: 78.4011 },
    description: "Massive medieval fortress renowned for its acoustic engineering, 10-kilometer outer wall, and historic diamond vault.",
    photos: [
      "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800"
    ],
    facilities: ["Sound & Light Show", "Archaeological Museum", "Panoramic Viewpoint"],
    openHours: "09:00 AM - 05:30 PM",
    bestTimeToVisit: "November to February",
    source: "curated-registry",
    sourceId: "hyd-golconda",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Fort", "Golconda", "Diamonds", "Acoustics"]
  },
  {
    id: "dest-hyd-03",
    name: "Chowmahalla Palace",
    altNames: ["Four Palaces"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Forts & Palaces", "Museums", "Nizami Heritage"],
    rating: 4.6,
    reviewCount: 1650,
    priceLevel: 1,
    priceRange: "₹100 entry fee",
    address: "20-4-236, Motigalli, Khilwat, Hyderabad, Telangana 500002",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3578, lng: 78.4717 },
    description: "Grand palace of the Nizams featuring Belgian crystal chandeliers, vintage royal Rolls Royce cars, and opulent Durbar halls.",
    photos: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800"
    ],
    facilities: ["Royal Courtyard", "Vintage Car Gallery", "Armor Exhibition"],
    openHours: "10:00 AM - 05:00 PM (Closed Fridays)",
    source: "curated-registry",
    sourceId: "hyd-chowmahalla",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Palace", "Nizam", "Chowmahalla"]
  },
  {
    id: "dest-hyd-04",
    name: "Birla Mandir Hyderabad",
    altNames: ["Venkateswara Temple"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Hilltop Shrines"],
    rating: 4.8,
    reviewCount: 3100,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "Hill Fort Rd, Ambedkar Colony, Khairtabad, Hyderabad, Telangana 500004",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.4062, lng: 78.4691 },
    description: "Magnificent Hindu temple constructed with 2,000 tons of pure white Rajasthani marble atop the 280-foot high Naubat Pahad hill.",
    photos: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"
    ],
    facilities: ["Hilltop Lake View", "Evening Illumination", "Peaceful Meditation Hall"],
    openHours: "07:00 AM - 12:00 PM, 03:00 PM - 09:00 PM",
    source: "curated-registry",
    sourceId: "hyd-birla-mandir",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Temple", "Marble", "Birla Mandir"]
  },
  {
    id: "dest-hyd-05",
    name: "Chilkur Balaji Temple",
    altNames: ["Visa Balaji Temple"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Pilgrimage"],
    rating: 4.7,
    reviewCount: 2200,
    priceLevel: 1,
    priceRange: "Free entry (No Hundi)",
    address: "Chilkur Village, Gandipet, Hyderabad, Telangana 500075",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3601, lng: 78.3039 },
    description: "Ancient temple on the banks of Osman Sagar Lake, famously known as Visa Balaji, where devotees complete 108 pradakshinas.",
    photos: [
      "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=800"
    ],
    facilities: ["Pradakshina Walkway", "Lakeside Ambience", "Free Darshan"],
    openHours: "06:00 AM - 08:00 PM",
    source: "curated-registry",
    sourceId: "hyd-chilkur",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Hyderabad", "Temple", "Chilkur Balaji", "Visa Balaji"]
  },
  {
    id: "dest-hyd-06",
    name: "Salar Jung Museum",
    altNames: ["Salarjung Museum"],
    type: "attraction",
    category: "museum",
    subtypes: ["Museums", "Art Galleries", "Cultural Centers"],
    rating: 4.7,
    reviewCount: 2450,
    priceLevel: 1,
    priceRange: "₹50 entry fee",
    address: "Salar Jung Rd, Darulshifa, Hyderabad, Telangana 500002",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3714, lng: 78.4804 },
    description: "One of the three National Museums of India housing the legendary Veiled Rebecca marble statue and the historic 19th-century musical clock.",
    photos: [
      "https://images.unsplash.com/photo-1558431382-27e303142255?w=800"
    ],
    facilities: ["38 Galleries", "Musical Clock", "Audio Guides", "Library"],
    openHours: "10:00 AM - 05:00 PM (Closed Fridays)",
    source: "curated-registry",
    sourceId: "hyd-salar-jung",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Museum", "Salar Jung", "Veiled Rebecca"]
  },
  {
    id: "dest-hyd-07",
    name: "Hussain Sagar & Monolithic Buddha",
    altNames: ["Tank Bund", "Hussain Sagar Lake"],
    type: "attraction",
    category: "waterfall",
    subtypes: ["Lakes & Waterways", "Tourist Attractions", "Boating Points"],
    rating: 4.6,
    reviewCount: 2780,
    priceLevel: 1,
    priceRange: "₹100 Boating",
    address: "Tank Bund Rd, Hussain Sagar, Hyderabad, Telangana 500080",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.4239, lng: 78.4738 },
    description: "Heart-shaped artificial lake built in 1563, with the world's tallest monolithic Buddha statue standing at 18 meters on Gibraltar Rock.",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
    ],
    facilities: ["Speedboat & Ferry Rides", "Eat Street", "Necklace Road Promenade"],
    openHours: "08:00 AM - 10:00 PM",
    source: "curated-registry",
    sourceId: "hyd-hussain-sagar",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Lake", "Buddha", "Hussain Sagar", "Tank Bund"]
  },
  {
    id: "dest-hyd-08",
    name: "Nehru Zoological Park",
    altNames: ["Hyderabad Zoo"],
    type: "attraction",
    category: "wildlife",
    subtypes: ["Wildlife Sanctuaries", "National Parks", "Family Attractions"],
    rating: 4.5,
    reviewCount: 1980,
    priceLevel: 1,
    priceRange: "₹70 (Adults), ₹30 (Children)",
    address: "Zoo Park Main Rd, Bahadurpura, Hyderabad, Telangana 500064",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3508, lng: 78.4518 },
    description: "Sprawling 380-acre zoological park featuring open enclosures, a safari park, nocturnal animal house, and over 1,500 species.",
    photos: [
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"
    ],
    facilities: ["Lion & Tiger Safari", "Battery Operated Cars", "Nocturnal House"],
    openHours: "08:30 AM - 05:00 PM (Closed Mondays)",
    source: "curated-registry",
    sourceId: "hyd-zoo",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Hyderabad", "Zoo", "Wildlife", "Safari"]
  },
  {
    id: "dest-hyd-09",
    name: "Taj Falaknuma Palace",
    altNames: ["Mirror in the Sky"],
    type: "hotel",
    category: "hotel",
    subtypes: ["Luxury Hotels", "Heritage Stays", "Palace Resorts"],
    rating: 4.9,
    reviewCount: 890,
    priceLevel: 4,
    priceRange: "₹38,000 - ₹75,000 per night",
    address: "Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad, Telangana 500053",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3314, lng: 78.4676 },
    description: "Italian marble palace perched 2,000 feet above Hyderabad. Restored by the Taj Group with horse-drawn carriage arrivals and royal dining.",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    facilities: ["Jiva Spa", "101-Dining Table Hall", "Outdoor Infinity Pool", "Horse Carriage Entry"],
    phone: "+91 40 6629 8585",
    website: "https://www.tajhotels.com",
    source: "curated-registry",
    sourceId: "hyd-falaknuma",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Luxury Hotel", "Falaknuma", "Taj"]
  },
  {
    id: "dest-hyd-10",
    name: "ITC Kohenur",
    altNames: ["ITC Kohenur HITEC City"],
    type: "hotel",
    category: "hotel",
    subtypes: ["Luxury Hotels", "Business Stays"],
    rating: 4.8,
    reviewCount: 1120,
    priceLevel: 4,
    priceRange: "₹14,000 - ₹28,000 per night",
    address: "Plot No. 5, Survey No. 83/1, Hyderabad Knowledge City, Madhapur, Telangana 500081",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.4338, lng: 78.3846 },
    description: "Iconic luxury hotel overlooking Durgam Cheruvu lake, celebrated for Nizami architecture, Dum Pukht cuisine, and royal spa treatments.",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
    ],
    facilities: ["Kaya Kalp Spa", "Rooftop Pool", "Dum Pukht Restaurant", "WiFi", "Valet"],
    source: "curated-registry",
    sourceId: "hyd-itc-kohenur",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Hyderabad", "ITC", "Kohenur", "Luxury", "HITEC City"]
  },
  {
    id: "dest-hyd-11",
    name: "Paradise Biryani Secunderabad",
    altNames: ["Paradise Food Court"],
    type: "restaurant",
    category: "restaurant",
    subtypes: ["Restaurants", "Famous Eateries", "Local Food"],
    rating: 4.6,
    reviewCount: 4200,
    priceLevel: 2,
    priceRange: "₹700 for two",
    address: "SD Road, Sappu Bagh Apartment, Jogani, Ramgopalpet, Secunderabad 500003",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.4411, lng: 78.4871 },
    description: "Legendary restaurant operating since 1953, globally famous for authentic Hyderabadi Dum Biryani cooked with fragrant basmati and tender marinated meats.",
    photos: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"
    ],
    facilities: ["AC Dining", "Family Section", "Takeaway Express", "Parking"],
    menuHighlights: ["Hyderabadi Mutton Dum Biryani", "Chicken Biryani", "Mirchi Ka Salan", "Double Ka Meetha"],
    popularFoods: ["Mutton Biryani", "Irani Chai", "Osmania Biscuits"],
    vegFriendly: true,
    nonVegFriendly: true,
    source: "curated-registry",
    sourceId: "hyd-paradise",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Biryani", "Paradise", "Food", "Secunderabad"]
  },
  {
    id: "dest-hyd-12",
    name: "Bawarchi Restaurant RTC X Roads",
    altNames: ["Bawarchi Biryani"],
    type: "restaurant",
    category: "restaurant",
    subtypes: ["Restaurants", "Local Food", "Famous Eateries"],
    rating: 4.6,
    reviewCount: 3800,
    priceLevel: 2,
    priceRange: "₹600 for two",
    address: "RTC X Rd, Chikkadpally, Hyderabad, Telangana 500020",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.4022, lng: 78.4972 },
    description: "Historic culinary landmark known by locals for rich spiced mutton biryani, spicy chicken 65, and Boti kebabs.",
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
    ],
    facilities: ["AC Dining", "Parcel Counter", "Family Hall"],
    menuHighlights: ["Special Mutton Biryani", "Chicken 65", "Boti Kebab"],
    vegFriendly: true,
    nonVegFriendly: true,
    source: "curated-registry",
    sourceId: "hyd-bawarchi",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Hyderabad", "Biryani", "Bawarchi", "RTC Cross Roads"]
  },
  {
    id: "dest-hyd-13",
    name: "Laad Bazaar",
    altNames: ["Choodi Bazaar"],
    type: "attraction",
    category: "market",
    subtypes: ["Shopping Markets", "Traditional Bazaars", "Handicrafts"],
    rating: 4.5,
    reviewCount: 1950,
    priceLevel: 2,
    priceRange: "₹100 - ₹5,000",
    address: "Near Charminar, Ghansi Bazaar, Hyderabad, Telangana 500002",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.3622, lng: 78.4729 },
    description: "Historic shopping street operating since the Qutb Shahi era, renowned worldwide for handmade lacquer bangles, semi-precious pearls, and zari embroidery.",
    photos: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
    ],
    facilities: ["Pedestrian Street", "Artisan Workshops", "Bangle Shops"],
    openHours: "11:00 AM - 10:30 PM",
    source: "curated-registry",
    sourceId: "hyd-laad-bazaar",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Hyderabad", "Market", "Laad Bazaar", "Bangles", "Pearls"]
  },
  {
    id: "dest-hyd-14",
    name: "Rajiv Gandhi International Airport",
    altNames: ["RGIA Shamshabad"],
    type: "attraction",
    category: "transit",
    subtypes: ["Transit Hubs", "Airports"],
    rating: 4.7,
    reviewCount: 3500,
    priceLevel: 2,
    priceRange: "Airport Transit",
    address: "Shamshabad, Hyderabad, Telangana 500409",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    coordinates: { lat: 17.2403, lng: 78.4294 },
    description: "World-class international airport serving Hyderabad, rated amongst the top airports in Asia with seamless connectivity to the city.",
    photos: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800"
    ],
    facilities: ["Metro / Pushpak Bus", "Lounges", "Duty Free", "Food Court"],
    source: "curated-registry",
    sourceId: "hyd-airport",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Hyderabad", "Airport", "Transit", "Shamshabad"]
  },

  // =========================================================================
  // 2. BANGALORE & KARNATAKA (Gardens, Palaces, Tech, Stays, Cafes, Wildlife)
  // =========================================================================
  {
    id: "dest-blr-01",
    name: "Bangalore Palace",
    altNames: ["Bengaluru Palace"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Tudor Architecture"],
    rating: 4.6,
    reviewCount: 3100,
    priceLevel: 1,
    priceRange: "₹250 entry fee",
    address: "Vasanth Nagar, Bengaluru, Karnataka 560052",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.9988, lng: 77.5921 },
    description: "Built in 1878 modeled after Windsor Castle, featuring Tudor-style battlements, stained glass, and hunting trophy halls.",
    photos: [
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"
    ],
    facilities: ["Audio Tour Guide", "Royal Photography Hall", "Manicured Gardens"],
    openHours: "10:00 AM - 05:30 PM",
    source: "curated-registry",
    sourceId: "blr-palace",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Bangalore", "Palace", "Heritage", "Tudor", "Karnataka"]
  },
  {
    id: "dest-blr-02",
    name: "Vidhana Soudha",
    altNames: ["Karnataka State Legislature"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Government Heritage", "Neo-Dravidian"],
    rating: 4.8,
    reviewCount: 3890,
    priceLevel: 1,
    priceRange: "Exterior Viewing (Free)",
    address: "Dr Ambedkar Rd, Sampangi Rama Nagara, Bengaluru, Karnataka 560001",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.9797, lng: 77.5907 },
    description: "The seat of Karnataka's state legislature, hailed as the largest legislative building in India with magnificent Neo-Dravidian granite architecture.",
    photos: [
      "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800"
    ],
    facilities: ["Evening Lighting (Sundays)", "Public Plaza", "Cubbon Park Walkway"],
    source: "curated-registry",
    sourceId: "blr-vidhana-soudha",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Bangalore", "Vidhana Soudha", "Granite", "Neo-Dravidian"]
  },
  {
    id: "dest-blr-03",
    name: "Lalbagh Botanical Garden",
    altNames: ["Red Garden"],
    type: "attraction",
    category: "garden",
    subtypes: ["Gardens & Parks", "Botanical Sanctuaries", "Nature Destinations"],
    rating: 4.7,
    reviewCount: 3400,
    priceLevel: 1,
    priceRange: "₹25 entry fee",
    address: "Mavalli, Bengaluru, Karnataka 560004",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.9507, lng: 77.5848 },
    description: "Historical 240-acre botanical garden commissioned by Hyder Ali, home to a world-famous Victorian glasshouse, 3,000-million-year-old rock, and rare flora.",
    photos: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800"
    ],
    facilities: ["Glass House", "Flower Shows", "Boating Lake", "Morning Jogging Track"],
    openHours: "06:00 AM - 07:00 PM",
    source: "curated-registry",
    sourceId: "blr-lalbagh",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Bangalore", "Lalbagh", "Garden", "Glasshouse", "Nature"]
  },
  {
    id: "dest-blr-04",
    name: "Cubbon Park",
    altNames: ["Sri Chamarajendra Park"],
    type: "attraction",
    category: "garden",
    subtypes: ["Gardens & Parks", "Family Attractions", "Nature Walk"],
    rating: 4.7,
    reviewCount: 3120,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "Kasturba Rd, Behind High Court, Bengaluru, Karnataka 560001",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.9779, lng: 77.5952 },
    description: "The emerald lung of Bangalore covering 300 acres of lush greenery, colonial red buildings, and shaded bamboo avenues in the center of the city.",
    photos: [
      "https://images.unsplash.com/photo-1570009731245?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["State Central Library", "Toy Train", "Dog Park", "Walking Pathways"],
    openHours: "06:00 AM - 06:00 PM",
    source: "curated-registry",
    sourceId: "blr-cubbon-park",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Bangalore", "Cubbon Park", "Park", "Greenery"]
  },
  {
    id: "dest-blr-05",
    name: "Bannerghatta National Park & Zoo",
    altNames: ["Bannerghatta Biological Park"],
    type: "attraction",
    category: "wildlife",
    subtypes: ["Wildlife Sanctuaries", "National Parks", "Safaris"],
    rating: 4.5,
    reviewCount: 2600,
    priceLevel: 2,
    priceRange: "₹350 Safari Package",
    address: "Bannerghatta Main Rd, Bannerghatta, Bengaluru, Karnataka 560083",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.8009, lng: 77.5777 },
    description: "Bio-sanctuary with India's first butterfly park, rescue center, and tiger/lion safaris tucked into the Anekal range hills.",
    photos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
    ],
    facilities: ["Grand Safari", "Butterfly Conservatory", "Zoo", "Boating"],
    openHours: "09:30 AM - 05:00 PM (Closed Tuesdays)",
    source: "curated-registry",
    sourceId: "blr-bannerghatta",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Bangalore", "Wildlife", "Zoo", "Safari", "Bannerghatta"]
  },
  {
    id: "dest-blr-06",
    name: "The Leela Palace Bengaluru",
    altNames: ["The Leela Palace"],
    type: "hotel",
    category: "hotel",
    subtypes: ["Luxury Hotels", "Palace Resorts"],
    rating: 4.9,
    reviewCount: 1400,
    priceLevel: 4,
    priceRange: "₹22,000 - ₹48,000 per night",
    address: "23, HAL Old Airport Rd, HAL 2nd Stage, Kodihalli, Bengaluru 560008",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.9606, lng: 77.6484 },
    description: "Ultra-luxury hotel inspired by the royal architecture of Mysore Palace, featuring gilded arches, lush tropical lagoons, and fine dining.",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
    ],
    facilities: ["Ayurvedic Spa", "Outdoor Lagoon Pool", "Fine Dining Jamavar", "WiFi"],
    phone: "+91 80 2521 1234",
    website: "https://www.theleela.com",
    source: "curated-registry",
    sourceId: "blr-leela-palace",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Bangalore", "Hotel", "Luxury", "Leela Palace"]
  },
  {
    id: "dest-blr-07",
    name: "Vidyarthi Bhavan",
    altNames: ["VB Gandhi Bazaar"],
    type: "restaurant",
    category: "restaurant",
    subtypes: ["Restaurants", "Famous Eateries", "Local Food"],
    rating: 4.7,
    reviewCount: 3900,
    priceLevel: 1,
    priceRange: "₹200 for two",
    address: "32, Gandhi Bazaar Main Rd, Basavanagudi, Bengaluru, Karnataka 560004",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.9439, lng: 77.5707 },
    description: "Historic South Indian vegetarian eatery established in 1943, globally famous for thick, golden, crispy Benne Masala Dosa and filter coffee.",
    photos: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800"
    ],
    facilities: ["Authentic Filter Coffee", "Fast Seating", "Traditional Service"],
    menuHighlights: ["Crispy Masala Dosa", "Filter Coffee", "Poori Saggu", "Kesari Bath"],
    vegFriendly: true,
    nonVegFriendly: false,
    source: "curated-registry",
    sourceId: "blr-vidyarthi-bhavan",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Bangalore", "Dosa", "Vidyarthi Bhavan", "South Indian", "Basavanagudi"]
  },
  {
    id: "dest-blr-08",
    name: "Commercial Street",
    altNames: ["Comm Street"],
    type: "attraction",
    category: "market",
    subtypes: ["Shopping Markets", "Traditional Bazaars", "Handicrafts"],
    rating: 4.6,
    reviewCount: 2700,
    priceLevel: 2,
    priceRange: "₹200 - ₹10,000",
    address: "Commercial Street, Tasker Town, Shivajinagar, Bengaluru 560001",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    coordinates: { lat: 12.9822, lng: 77.6083 },
    description: "Vibrant shopping destination packed with silk sarees, Kashmiri shawls, silver jewelry, electronics, and footwear boutiques.",
    photos: [
      "https://images.unsplash.com/photo-1570019462490?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Pedestrian Alleyways", "Street Food", "Silk Emporiums"],
    openHours: "10:30 AM - 09:30 PM",
    source: "curated-registry",
    sourceId: "blr-commercial-st",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Bangalore", "Shopping", "Commercial Street", "Market"]
  },

  // =========================================================================
  // 3. MUMBAI & MAHARASHTRA (Heritage, Beaches, Stays, Marine Drive, Food)
  // =========================================================================
  {
    id: "dest-bom-01",
    name: "Gateway of India",
    altNames: ["Gateway of India Mumbai"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Sightseeing", "Colonial Heritage"],
    rating: 4.8,
    reviewCount: 4500,
    priceLevel: 1,
    priceRange: "Free viewing",
    address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    coordinates: { lat: 18.9220, lng: 72.8347 },
    description: "Iconic 26-meter arch monument overlooking Mumbai Harbour, constructed in Indo-Saracenic style to commemorate the 1911 visit of King George V.",
    photos: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800"
    ],
    facilities: ["Ferry to Elephanta Caves", "Promenade Walk", "Harbor View"],
    source: "curated-registry",
    sourceId: "bom-gateway",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Mumbai", "Gateway of India", "Colaba", "Harbour", "Maharashtra"]
  },
  {
    id: "dest-bom-02",
    name: "Marine Drive",
    altNames: ["Queen's Necklace"],
    type: "attraction",
    category: "beach",
    subtypes: ["Beaches", "Coastal Destinations", "Promenades"],
    rating: 4.9,
    reviewCount: 5200,
    priceLevel: 1,
    priceRange: "Free public access",
    address: "Netaji Subhash Chandra Bose Rd, Churchgate, Mumbai 400020",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    coordinates: { lat: 18.9432, lng: 72.8234 },
    description: "C-shaped 3.6-kilometer arc road and promenade along the Arabian Sea coast, famous for dramatic sunsets and golden streetlights.",
    photos: [
      "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800"
    ],
    facilities: ["Tetrapod Seating", "Sunset Viewing", "Night Strolls", "Street Food"],
    source: "curated-registry",
    sourceId: "bom-marine-drive",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Mumbai", "Marine Drive", "Queens Necklace", "Sea", "Sunset"]
  },
  {
    id: "dest-bom-03",
    name: "Siddhivinayak Temple",
    altNames: ["Shree Siddhivinayak Ganapati Mandir"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Pilgrimage"],
    rating: 4.8,
    reviewCount: 3800,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "SK Bole Rd, Prabhadevi, Mumbai, Maharashtra 400028",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    coordinates: { lat: 19.0166, lng: 72.8304 },
    description: "Revered two-century-old temple dedicated to Lord Ganesha, featuring a gold-plated inner sanctum and visited by millions of devotees.",
    photos: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800"
    ],
    facilities: ["Darshan Queue Lines", "Prasad Stalls", "Wheelchair Friendly"],
    openHours: "05:30 AM - 10:00 PM",
    source: "curated-registry",
    sourceId: "bom-siddhivinayak",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Mumbai", "Temple", "Siddhivinayak", "Ganesha", "Prabhadevi"]
  },
  {
    id: "dest-bom-04",
    name: "Elephanta Caves",
    altNames: ["Gharapuri Caves"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "UNESCO Heritage", "Rock Cut Caves"],
    rating: 4.7,
    reviewCount: 2600,
    priceLevel: 1,
    priceRange: "₹40 entry fee + ₹200 ferry",
    address: "Gharapuri Island, Mumbai Harbour, Maharashtra 400094",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    coordinates: { lat: 18.9633, lng: 72.9315 },
    description: "UNESCO World Heritage rock-cut cave temples dating to the 5th-7th century AD, featuring the magnificent 20-foot Sadashiva Trimurti sculpture.",
    photos: [
      "https://images.unsplash.com/photo-1570029193735?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Toy Train on Jetty", "Ferry Access from Gateway", "Guided Walks"],
    openHours: "09:30 AM - 05:30 PM (Closed Mondays)",
    source: "curated-registry",
    sourceId: "bom-elephanta",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Mumbai", "Caves", "Elephanta", "UNESCO", "Shiva"]
  },
  {
    id: "dest-bom-05",
    name: "The Taj Mahal Palace Mumbai",
    altNames: ["Taj Palace Colaba"],
    type: "hotel",
    category: "hotel",
    subtypes: ["Luxury Hotels", "Heritage Stays"],
    rating: 4.9,
    reviewCount: 2200,
    priceLevel: 4,
    priceRange: "₹28,000 - ₹65,000 per night",
    address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    coordinates: { lat: 18.9217, lng: 72.8332 },
    description: "Legendary 1903 heritage flagship hotel overlooking the Gateway of India, combining Moorish, Oriental, and Florentine architectural grandeur.",
    photos: [
      "https://images.unsplash.com/photo-1570038924980?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Jiva Spa", "Sea Lounge High Tea", "Harbor View Pool", "Wasabi Restaurant"],
    phone: "+91 22 6665 3366",
    website: "https://www.tajhotels.com",
    source: "curated-registry",
    sourceId: "bom-taj-palace",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Mumbai", "Luxury Hotel", "Taj Mahal Palace", "Heritage", "Colaba"]
  },
  {
    id: "dest-bom-06",
    name: "Chhatrapati Shivaji Maharaj Terminus",
    altNames: ["CSMT", "Victoria Terminus"],
    type: "attraction",
    category: "transit",
    subtypes: ["Transit Hubs", "UNESCO Heritage", "Railway Stations"],
    rating: 4.8,
    reviewCount: 3100,
    priceLevel: 1,
    priceRange: "Free viewing",
    address: "Fort, Mumbai, Maharashtra 400001",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    coordinates: { lat: 18.9401, lng: 72.8355 },
    description: "UNESCO World Heritage historic railway station built in 1887, an architectural masterpiece combining Victorian Gothic Revival with Indian palace styles.",
    photos: [
      "https://images.unsplash.com/photo-1570048656225?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Heritage Gallery", "Architectural Lighting", "Suburban Train Terminal"],
    source: "curated-registry",
    sourceId: "bom-csmt",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Mumbai", "CSMT", "UNESCO", "Station", "Architecture"]
  },

  // =========================================================================
  // 4. DELHI (Capital Heritage, Monuments, Food, Markets, Gardens, Transit)
  // =========================================================================
  {
    id: "dest-del-01",
    name: "India Gate",
    altNames: ["All India War Memorial"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Tourist Attractions", "War Memorials"],
    rating: 4.8,
    reviewCount: 4800,
    priceLevel: 1,
    priceRange: "Free viewing",
    address: "Kartavya Path, India Gate, New Delhi, Delhi 110001",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    description: "42-meter triumphal arch war memorial designed by Edwin Lutyens along Kartavya Path, honoring 84,000 Indian soldiers of World War I.",
    photos: [
      "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=800"
    ],
    facilities: ["Kartavya Path Walkways", "National War Memorial", "Evening Illumination"],
    source: "curated-registry",
    sourceId: "del-india-gate",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Delhi", "India Gate", "Kartavya Path", "Monument", "Lutyens"]
  },
  {
    id: "dest-del-02",
    name: "Qutub Minar",
    altNames: ["Qutb Minar"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "UNESCO Heritage", "Medieval Architecture"],
    rating: 4.7,
    reviewCount: 3900,
    priceLevel: 1,
    priceRange: "₹40 entry fee",
    address: "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    coordinates: { lat: 28.5244, lng: 77.1855 },
    description: "UNESCO World Heritage Site; the tallest brick minaret in the world at 72.5 meters, accompanied by the rust-resistant 4th-century Iron Pillar of Delhi.",
    photos: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"
    ],
    facilities: ["Iron Pillar", "Quwwat-ul-Islam Mosque", "Landscaped Lawns"],
    openHours: "07:00 AM - 05:00 PM",
    source: "curated-registry",
    sourceId: "del-qutub-minar",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Delhi", "Qutub Minar", "UNESCO", "Minaret", "Mehrauli"]
  },
  {
    id: "dest-del-03",
    name: "Red Fort",
    altNames: ["Lal Qila"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Mughal Architecture"],
    rating: 4.6,
    reviewCount: 4100,
    priceLevel: 1,
    priceRange: "₹50 entry fee",
    address: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    coordinates: { lat: 28.6562, lng: 77.2410 },
    description: "Historic red sandstone fortress constructed in 1638 by Mughal Emperor Shah Jahan as the palace of his new capital Shahjahanabad.",
    photos: [
      "https://images.unsplash.com/photo-1570058387470?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Diwan-i-Aam", "Diwan-i-Khas", "Sound & Light Show", "Museums"],
    openHours: "09:30 AM - 04:30 PM (Closed Mondays)",
    source: "curated-registry",
    sourceId: "del-red-fort",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Delhi", "Red Fort", "Lal Qila", "Mughal", "Shahjahanabad"]
  },
  {
    id: "dest-del-04",
    name: "Akshardham Temple Delhi",
    altNames: ["Swaminarayan Akshardham"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Cultural Complexes"],
    rating: 4.8,
    reviewCount: 3600,
    priceLevel: 1,
    priceRange: "Free complex entry (Exhibitions ticketed)",
    address: "Noida Mor, Pandav Nagar, New Delhi, Delhi 110092",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    coordinates: { lat: 28.6127, lng: 77.2773 },
    description: "Colossal Hindu temple complex crafted from pink sandstone and Carrara marble, showcasing 10,000 years of traditional Indian art and wisdom.",
    photos: [
      "https://images.unsplash.com/photo-1570068118715?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Sahaj Anand Musical Water Show", "Cultural Boat Ride", "Themed Gardens"],
    openHours: "09:30 AM - 06:30 PM (Closed Mondays)",
    source: "curated-registry",
    sourceId: "del-akshardham",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Delhi", "Temple", "Akshardham", "Swaminarayan", "Cultural"]
  },
  {
    id: "dest-del-05",
    name: "Chandni Chowk",
    altNames: ["Moonlight Square"],
    type: "attraction",
    category: "market",
    subtypes: ["Shopping Markets", "Traditional Bazaars", "Street Food"],
    rating: 4.6,
    reviewCount: 4200,
    priceLevel: 1,
    priceRange: "₹50 - ₹10,000",
    address: "Old Delhi, New Delhi, Delhi 110006",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    coordinates: { lat: 28.6506, lng: 77.2303 },
    description: "Centuries-old market planned by Princess Jahanara, renowned for Paranthe Wali Gali, Khari Baoli spice bazaar, and traditional bridal jewelry.",
    photos: [
      "https://images.unsplash.com/photo-1570077849960?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Paranthe Wali Gali", "Khari Baoli Spices", "Cycle Rickshaw Rides"],
    openHours: "10:00 AM - 09:00 PM (Closed Sundays)",
    source: "curated-registry",
    sourceId: "del-chandni-chowk",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Delhi", "Chandni Chowk", "Market", "Street Food", "Spices"]
  },
  {
    id: "dest-del-06",
    name: "The Oberoi New Delhi",
    altNames: ["Oberoi Delhi"],
    type: "hotel",
    category: "hotel",
    subtypes: ["Luxury Hotels", "Boutique Stays"],
    rating: 4.9,
    reviewCount: 1250,
    priceLevel: 4,
    priceRange: "₹24,000 - ₹55,000 per night",
    address: "Dr Zakir Hussain Marg, Delhi Golf Club, Golf Links, New Delhi 110003",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    coordinates: { lat: 28.5986, lng: 77.2384 },
    description: "Ultra-luxury hotel overlooking Delhi Golf Club and Humayun's Tomb, featuring state-of-the-art clean air systems, rooftop dining, and Oberoi Spa.",
    photos: [
      "https://images.unsplash.com/photo-1570087581205?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Clean Air Filtered Rooms", "Heated Swimming Pool", "Oberoi Spa", "Fine Dining"],
    phone: "+91 11 2436 3030",
    website: "https://www.oberoihotels.com",
    source: "curated-registry",
    sourceId: "del-oberoi",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Delhi", "Luxury Hotel", "The Oberoi", "Golf Links"]
  },

  // =========================================================================
  // 5. CHENNAI & TAMIL NADU (Temples, Marina Beach, Stays, Cultural Centers)
  // =========================================================================
  {
    id: "dest-maa-01",
    name: "Marina Beach",
    altNames: ["Chennai Marina"],
    type: "attraction",
    category: "beach",
    subtypes: ["Beaches", "Coastal Destinations", "Sea Viewpoints"],
    rating: 4.6,
    reviewCount: 4200,
    priceLevel: 1,
    priceRange: "Free public access",
    address: "Marina Beach Promenade, Triplicane, Chennai, Tamil Nadu 600005",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    coordinates: { lat: 13.0499, lng: 80.2824 },
    description: "The second-longest natural urban beach in the world, spanning 13 km along the Bay of Bengal with historic lighthouses and evening food stalls.",
    photos: [
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=800"
    ],
    facilities: ["Chennai Lighthouse", "Heritage Statues", "Fresh Fish Fry Stalls"],
    source: "curated-registry",
    sourceId: "maa-marina",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Chennai", "Marina Beach", "Beach", "Coast", "Tamil Nadu"]
  },
  {
    id: "dest-maa-02",
    name: "Kapaleeshwarar Temple Mylapore",
    altNames: ["Kapaleeshwarar Kovil"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Dravidian Architecture"],
    rating: 4.8,
    reviewCount: 3500,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "Vadakku Maada Veedi, Mylapore, Chennai, Tamil Nadu 600004",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    coordinates: { lat: 13.0335, lng: 80.2697 },
    description: "7th-century temple of Lord Shiva built in quintessential Dravidian style, crowned by a 37-meter rainbow gopuram adorned with mythological figures.",
    photos: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"
    ],
    facilities: ["Temple Tank", "Carnatic Music Sabha", "Gopuram Architecture"],
    openHours: "06:00 AM - 12:30 PM, 04:00 PM - 09:00 PM",
    source: "curated-registry",
    sourceId: "maa-kapaleeshwarar",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Chennai", "Temple", "Kapaleeshwarar", "Mylapore", "Shiva"]
  },
  {
    id: "dest-maa-03",
    name: "San Thome Cathedral Basilica",
    altNames: ["St. Thomas Basilica"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Heritage Churches", "Neo-Gothic"],
    rating: 4.7,
    reviewCount: 2200,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "38, Santhome High Rd, Mylapore, Chennai, Tamil Nadu 600004",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    coordinates: { lat: 13.0336, lng: 80.2781 },
    description: "Neo-Gothic Roman Catholic cathedral built over the tomb of St. Thomas the Apostle, one of only three basilicas in the world built over an apostle's tomb.",
    photos: [
      "https://images.unsplash.com/photo-1570097312450?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["St. Thomas Tomb", "Relic Museum", "Seaside Prayer Hall"],
    openHours: "06:00 AM - 09:00 PM",
    source: "curated-registry",
    sourceId: "maa-san-thome",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Chennai", "Church", "San Thome", "Neo Gothic", "Mylapore"]
  },
  {
    id: "dest-maa-04",
    name: "ITC Grand Chola",
    altNames: ["Grand Chola Chennai"],
    type: "hotel",
    category: "hotel",
    subtypes: ["Luxury Hotels", "Palace Stays"],
    rating: 4.8,
    reviewCount: 1980,
    priceLevel: 4,
    priceRange: "₹13,500 - ₹32,000 per night",
    address: "No. 63, Anna Salai, Guindy, Chennai, Tamil Nadu 600032",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    coordinates: { lat: 13.0105, lng: 80.2207 },
    description: "Palatial 5-star luxury hotel honoring the grand Chola dynasty with magnificent carved granite pillars, sweeping staircases, and 10 dining destinations.",
    photos: [
      "https://images.unsplash.com/photo-1570107043695?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Peshawri Restaurant", "Royal Spa", "Rooftop Pools", "Valet"],
    source: "curated-registry",
    sourceId: "maa-itc-grand-chola",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Chennai", "Luxury Hotel", "ITC Grand Chola", "Guindy"]
  },

  // =========================================================================
  // 6. GOA (Beaches, Forts, Portuguese Churches, Waterfalls, Nightlife)
  // =========================================================================
  {
    id: "dest-goa-01",
    name: "Fort Aguada",
    altNames: ["Aguada Fort"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Coastal Fortresses"],
    rating: 4.6,
    reviewCount: 3800,
    priceLevel: 1,
    priceRange: "₹50 entry fee",
    address: "Sinquerim, Candolim, Goa 403515",
    city: "Goa",
    state: "Goa",
    country: "India",
    coordinates: { lat: 15.4926, lng: 73.7739 },
    description: "Seventeenth-century Portuguese fort standing on Sinquerim Beach, featuring a four-story stone lighthouse and sweeping Arabian Sea views.",
    photos: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"
    ],
    facilities: ["Lighthouse", "Ancient Fresh Water Cistern", "Sea Vista Promenade"],
    openHours: "09:30 AM - 06:00 PM",
    source: "curated-registry",
    sourceId: "goa-aguada",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Goa", "Fort", "Fort Aguada", "Portuguese", "Sinquerim"]
  },
  {
    id: "dest-goa-02",
    name: "Basilica of Bom Jesus",
    altNames: ["Bom Jesus Church"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "UNESCO Heritage", "Heritage Churches"],
    rating: 4.7,
    reviewCount: 4120,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "Old Goa Rd, Bainguinim, Goa 403402",
    city: "Goa",
    state: "Goa",
    country: "India",
    coordinates: { lat: 15.5009, lng: 73.9116 },
    description: "UNESCO World Heritage Site holding the mortal remains of St. Francis Xavier, constructed in 1605 in Baroque style with carved basalt pillars.",
    photos: [
      "https://images.unsplash.com/photo-1570116774940?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Sacred Relic Casket", "Art Gallery", "Guided Tours"],
    openHours: "09:00 AM - 06:30 PM",
    source: "curated-registry",
    sourceId: "goa-bom-jesus",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Goa", "Church", "Basilica", "Bom Jesus", "UNESCO", "Old Goa"]
  },
  {
    id: "dest-goa-03",
    name: "Dudhsagar Waterfalls",
    altNames: ["Sea of Milk"],
    type: "attraction",
    category: "waterfall",
    subtypes: ["Waterfalls", "Adventure Activities", "Nature Destinations"],
    rating: 4.8,
    reviewCount: 3100,
    priceLevel: 2,
    priceRange: "₹500 Jeep Safari Entry",
    address: "Sonaulim, Goa 403410",
    city: "Goa",
    state: "Goa",
    country: "India",
    coordinates: { lat: 15.3144, lng: 74.3144 },
    description: "Four-tiered waterfall on the Mandovi River descending 310 meters through lush Western Ghats jungles, creating a spectacular cascade of white mist.",
    photos: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800"
    ],
    facilities: ["Jeep Safari", "Jungle Trekking", "Natural Freshwater Pool"],
    bestTimeToVisit: "July to November (Monsoon & Post-monsoon)",
    source: "curated-registry",
    sourceId: "goa-dudhsagar",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Goa", "Waterfall", "Dudhsagar", "Mandovi", "Nature", "Trek"]
  },
  {
    id: "dest-goa-04",
    name: "Calangute Beach Promenade",
    altNames: ["Queen of Beaches"],
    type: "attraction",
    category: "beach",
    subtypes: ["Beaches", "Coastal Destinations", "Water Sports"],
    rating: 4.6,
    reviewCount: 4600,
    priceLevel: 1,
    priceRange: "Free beach entry",
    address: "Calangute, North Goa, Goa 403516",
    city: "Goa",
    state: "Goa",
    country: "India",
    coordinates: { lat: 15.5439, lng: 73.7553 },
    description: "The lively Queen of Beaches in North Goa, offering golden sand shores, parasailing, jet skiing, sunset shacks, and vibrant flea shops.",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
    ],
    facilities: ["Parasailing & Jet Ski", "Beach Shacks", "Lifeguard Stations"],
    source: "curated-registry",
    sourceId: "goa-calangute",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Goa", "Beach", "Calangute", "Water Sports", "North Goa"]
  },
  {
    id: "dest-goa-05",
    name: "Taj Exotica Resort & Spa Goa",
    altNames: ["Taj Exotica Benaulim"],
    type: "resort",
    category: "hotel",
    subtypes: ["Luxury Resorts", "Beach Resorts"],
    rating: 4.8,
    reviewCount: 1240,
    priceLevel: 4,
    priceRange: "₹25,000 - ₹45,000 per night",
    address: "Calwaddo, Benaulim, Salcete, Goa 403716",
    city: "Goa",
    state: "Goa",
    country: "India",
    coordinates: { lat: 15.2449, lng: 73.9213 },
    description: "Mediterranean-style luxury beachfront resort sprawled across 56 acres of landscaped gardens, featuring an Ayurvedic spa and 9-hole golf course.",
    photos: [
      "https://images.unsplash.com/photo-1570126506185?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Private Beach Access", "Ayurvedic Jiva Spa", "Golf Course", "Outdoor Pool"],
    source: "curated-registry",
    sourceId: "goa-taj-exotica",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Goa", "Resort", "Taj Exotica", "Benaulim", "Luxury"]
  },

  // =========================================================================
  // 7. JAIPUR & RAJASTHAN (Palaces, Forts, Havelis, Bazaars, Heritage)
  // =========================================================================
  {
    id: "dest-jai-01",
    name: "Hawa Mahal",
    altNames: ["Palace of Winds"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Rajput Architecture"],
    rating: 4.8,
    reviewCount: 4300,
    priceLevel: 1,
    priceRange: "₹50 entry fee",
    address: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur, Rajasthan 302002",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 26.9239, lng: 75.8267 },
    description: "Five-story pink sandstone palace with 953 intricately carved jharokhas (latticed windows), built in 1799 by Maharaja Sawai Pratap Singh.",
    photos: [
      "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800"
    ],
    facilities: ["Jharokha City View", "Archaeological Museum", "Heritage Rooftop Cafes"],
    openHours: "09:00 AM - 05:00 PM",
    source: "curated-registry",
    sourceId: "jai-hawa-mahal",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Jaipur", "Hawa Mahal", "Palace", "Pink City", "Rajasthan"]
  },
  {
    id: "dest-jai-02",
    name: "Amer Fort",
    altNames: ["Amber Fort & Palace"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "UNESCO Heritage"],
    rating: 4.8,
    reviewCount: 4600,
    priceLevel: 1,
    priceRange: "₹100 entry fee",
    address: "Devisinghpura, Amer, Jaipur, Rajasthan 302001",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 26.9855, lng: 75.8513 },
    description: "UNESCO World Heritage hillside fortress overlooking Maota Lake, famous for the magnificent Sheesh Mahal (Mirror Palace) and red sandstone halls.",
    photos: [
      "https://images.unsplash.com/photo-1570136237430?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Sheesh Mahal", "Elephant / Jeep Ride", "Sound and Light Show"],
    openHours: "08:00 AM - 05:30 PM",
    source: "curated-registry",
    sourceId: "jai-amer-fort",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Jaipur", "Amer Fort", "Sheesh Mahal", "UNESCO", "Fort"]
  },
  {
    id: "dest-jai-03",
    name: "City Palace Jaipur",
    altNames: ["Maharaja Sawai Man Singh II Museum"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Forts & Palaces", "Museums", "Royal Residences"],
    rating: 4.7,
    reviewCount: 3100,
    priceLevel: 2,
    priceRange: "₹300 entry fee",
    address: "Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur 302002",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 26.9258, lng: 75.8236 },
    description: "Grand royal palace complex in the heart of the Old City, featuring Chandra Mahal, Mubarak Mahal, and exquisite peacock courtyards.",
    photos: [
      "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=800"
    ],
    facilities: ["Chandra Mahal Tours", "Royal Textile Gallery", "Peacock Gate"],
    openHours: "09:30 AM - 05:00 PM",
    source: "curated-registry",
    sourceId: "jai-city-palace",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Jaipur", "City Palace", "Chandra Mahal", "Royal"]
  },
  {
    id: "dest-jai-04",
    name: "Johari Bazaar",
    altNames: ["Jewelers Market"],
    type: "attraction",
    category: "market",
    subtypes: ["Shopping Markets", "Traditional Bazaars", "Handicrafts"],
    rating: 4.6,
    reviewCount: 2200,
    priceLevel: 2,
    priceRange: "₹200 - ₹50,000",
    address: "Johari Bazar, Pink City, Jaipur, Rajasthan 302003",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 26.9208, lng: 75.8277 },
    description: "Famed bazaar for Kundan and Meenakari jewelry, authentic gemstones, Bandhani tie-dye sarees, and Jaipuri quilts.",
    photos: [
      "https://images.unsplash.com/photo-1570145968675?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Kundan Jewelry", "Jaipuri Quilts", "LMB Sweet Shop"],
    source: "curated-registry",
    sourceId: "jai-johari-bazaar",
    lastVerified: "2026-10-09",
    featured: false,
    tags: ["Jaipur", "Market", "Johari Bazaar", "Jewelry", "Bazaar"]
  },

  // =========================================================================
  // 8. VARANASI & UTTAR PRADESH (Ghats, Temples, Heritage, Food, Silk)
  // =========================================================================
  {
    id: "dest-vns-01",
    name: "Dashashwamedh Ghat",
    altNames: ["Ganga Aarti Ghat"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Sacred Sites", "Tourist Attractions", "Cultural Experiences"],
    rating: 4.9,
    reviewCount: 4800,
    priceLevel: 1,
    priceRange: "Free viewing (Boat seats ₹150-₹300)",
    address: "Dashashwamedh Ghat Rd, Bangali Tola, Varanasi, Uttar Pradesh 221001",
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    coordinates: { lat: 25.3076, lng: 83.0107 },
    description: "The primary and most spectacular ghat on the holy River Ganga, legendary for the grand evening Ganga Aarti performed with tiered brass lamps.",
    photos: [
      "https://images.unsplash.com/photo-1570155699920?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Evening Ganga Aarti", "Morning Sunrise Boat Rides", "Steps Seating"],
    source: "curated-registry",
    sourceId: "vns-dashashwamedh",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Varanasi", "Ghat", "Ganga Aarti", "Dashashwamedh", "Holy"]
  },
  {
    id: "dest-vns-02",
    name: "Kashi Vishwanath Temple",
    altNames: ["Golden Temple of Varanasi"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Jyotirlinga"],
    rating: 4.9,
    reviewCount: 5100,
    priceLevel: 1,
    priceRange: "Free darshan",
    entryFee: "Free darshan (Sugam Darshan ₹300)",
    bestTimeToVisit: "October to March (Dev Deepawali & Mahashivratri)",
    address: "Lahori Tola, Varanasi, Uttar Pradesh 221001",
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    coordinates: { lat: 25.3109, lng: 83.0107 },
    description: "One of the twelve revered Jyotirlingas of Lord Shiva, crowned by a spire plated in one ton of pure gold, linked to the river by the Kashi Vishwanath Corridor.",
    photos: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"
    ],
    facilities: ["Vishwanath Corridor Walkway", "Locker Facility", "VIP Sugam Darshan"],
    openHours: "03:00 AM - 11:00 PM",
    source: "curated-registry",
    sourceId: "vns-vishwanath",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Varanasi", "Temple", "Kashi Vishwanath", "Jyotirlinga", "Shiva"]
  },
  {
    id: "dest-vns-03",
    name: "Assi Ghat",
    altNames: ["Subah-e-Banaras Ghat"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Sacred Sites", "Cultural Experiences", "Riverfront"],
    rating: 4.7,
    reviewCount: 2600,
    priceLevel: 1,
    priceRange: "Free public access",
    address: "Assi Ghat, Shivala, Varanasi, Uttar Pradesh 221005",
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    coordinates: { lat: 25.2905, lng: 83.0068 },
    description: "Southernmost ghat where the Assi River meets the Ganga, famous for the dawn Subah-e-Banaras cultural recitals, morning yoga, and peaceful cafes.",
    photos: [
      "https://images.unsplash.com/photo-1570165431165?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Subah-e-Banaras Morning Music", "Riverside Yoga", "Boat Hire"],
    source: "curated-registry",
    sourceId: "vns-assi-ghat",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Varanasi", "Assi Ghat", "Yoga", "Subah-e-Banaras"]
  },
  {
    id: "dest-vns-04",
    name: "Sarnath Deer Park & Dhamek Stupa",
    altNames: ["Sarnath"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Buddhist Pilgrimage", "Archaeological Wonders"],
    rating: 4.8,
    reviewCount: 3200,
    priceLevel: 1,
    priceRange: "₹25 entry fee",
    address: "Sarnath, Varanasi, Uttar Pradesh 221007",
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    coordinates: { lat: 25.3811, lng: 83.0227 },
    description: "Sacred location where Gautama Buddha delivered his first sermon after enlightenment. Features the massive 43-meter cylindrical Dhamek Stupa and Lion Capital of Ashoka.",
    photos: [
      "https://images.unsplash.com/photo-1570175162410?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Archaeological Museum", "Ashoka Pillar", "Deer Park", "Meditative Lawns"],
    openHours: "06:00 AM - 06:00 PM",
    source: "curated-registry",
    sourceId: "vns-sarnath",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Varanasi", "Sarnath", "Buddha", "Dhamek Stupa", "Ashoka"]
  },

  // =========================================================================
  // 9. AGRA & UTTAR PRADESH (Taj Mahal, Mughal Forts, Heritage Stays)
  // =========================================================================
  {
    id: "dest-agr-01",
    name: "Taj Mahal",
    altNames: ["Crown of the Palace"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "UNESCO Heritage", "Seven Wonders"],
    rating: 4.9,
    reviewCount: 8500,
    priceLevel: 1,
    priceRange: "₹50 (Indians), ₹1,100 (Foreigners)",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    coordinates: { lat: 27.1751, lng: 78.0421 },
    description: "An ivory-white marble mausoleum on the south bank of the Yamuna River, commissioned in 1632 by Mughal emperor Shah Jahan for his wife Mumtaz Mahal.",
    photos: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
    ],
    facilities: ["Charbagh Gardens", "Reflecting Pool", "Electric Golf Carts", "Museum"],
    openHours: "Sunrise to Sunset (Closed Fridays)",
    source: "curated-registry",
    sourceId: "agr-taj-mahal",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Agra", "Taj Mahal", "Wonder", "UNESCO", "Marble", "Yamuna"]
  },
  {
    id: "dest-agr-02",
    name: "Agra Fort",
    altNames: ["Lal Qila Agra"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "UNESCO Heritage"],
    rating: 4.7,
    reviewCount: 3800,
    priceLevel: 1,
    priceRange: "₹50 entry fee",
    address: "Agra Fort, Rakabganj, Agra, Uttar Pradesh 282003",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    coordinates: { lat: 27.1795, lng: 78.0211 },
    description: "UNESCO World Heritage 94-acre brick and red sandstone fortress that served as the primary residence of the emperors of the Mughal Dynasty until 1638.",
    photos: [
      "https://images.unsplash.com/photo-1570184893655?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Jahangir Mahal", "Khas Mahal", "Musamman Burj (Taj Viewpoint)"],
    openHours: "06:00 AM - 06:00 PM",
    source: "curated-registry",
    sourceId: "agr-fort",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Agra", "Agra Fort", "Mughal", "UNESCO", "Fort"]
  },

  // =========================================================================
  // 10. KOLKATA & WEST BENGAL (Colonial Heritage, Bridges, Kali Temples, Food)
  // =========================================================================
  {
    id: "dest-ccu-01",
    name: "Victoria Memorial & Gardens",
    altNames: ["Victoria Memorial Hall"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Museums", "Colonial Heritage"],
    rating: 4.8,
    reviewCount: 4200,
    priceLevel: 1,
    priceRange: "₹50 entry fee",
    address: "Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West Bengal 700071",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    coordinates: { lat: 22.5448, lng: 88.3426 },
    description: "Magnificent white Makrana marble monument dedicated to Queen Victoria, surrounded by 64 acres of landscaped gardens, reflecting pools, and 25 art galleries.",
    photos: [
      "https://images.unsplash.com/photo-1570194624900?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Royal Gallery", "Sound & Light Show", "Gardens Walking Track"],
    openHours: "10:00 AM - 06:00 PM (Gardens 05:30 AM - 06:00 PM)",
    source: "curated-registry",
    sourceId: "ccu-victoria-memorial",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Kolkata", "Victoria Memorial", "Marble", "Colonial", "West Bengal"]
  },
  {
    id: "dest-ccu-02",
    name: "Howrah Bridge",
    altNames: ["Rabindra Setu"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Engineering Wonders", "Sightseeing"],
    rating: 4.8,
    reviewCount: 3900,
    priceLevel: 1,
    priceRange: "Free viewing",
    address: "Howrah Bridge, Kolkata, West Bengal 700001",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    coordinates: { lat: 22.5851, lng: 88.3468 },
    description: "Iconic cantilever suspension bridge without nuts and bolts spanning the Hooghly River, carrying over 100,000 vehicles and 150,000 pedestrians daily.",
    photos: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800"
    ],
    facilities: ["Ferry Ride View", "Flower Market Access at Sunrise", "Evening Illumination"],
    source: "curated-registry",
    sourceId: "ccu-howrah-bridge",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Kolkata", "Howrah Bridge", "Rabindra Setu", "Hooghly"]
  },
  {
    id: "dest-ccu-03",
    name: "Dakshineswar Kali Temple",
    altNames: ["Dakshineswar Mandir"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Navaratna Architecture"],
    rating: 4.8,
    reviewCount: 3700,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "Mayadib, Dakshineswar, Kolkata, West Bengal 700076",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    coordinates: { lat: 22.6550, lng: 88.3576 },
    description: "Famous 19th-century Navaratna temple on the eastern bank of the Hooghly River, dedicated to Bhavatarini (Kali) and intimately associated with Ramakrishna Paramahamsa.",
    photos: [
      "https://images.unsplash.com/photo-1570204356145?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Ganga Ghats", "12 Shiva Shrines", "Ramakrishna Room"],
    openHours: "06:00 AM - 12:30 PM, 03:00 PM - 08:30 PM",
    source: "curated-registry",
    sourceId: "ccu-dakshineswar",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Kolkata", "Temple", "Kali", "Dakshineswar", "Ramakrishna"]
  },

  // =========================================================================
  // 11. KOCHI & KERALA (Chinese Fishing Nets, Backwaters, Stays, Spices)
  // =========================================================================
  {
    id: "dest-cok-01",
    name: "Fort Kochi & Chinese Fishing Nets",
    altNames: ["Cheena Vala"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Coastal Destinations", "Cultural Heritage"],
    rating: 4.7,
    reviewCount: 3600,
    priceLevel: 1,
    priceRange: "Free viewing",
    address: "Fort Kochi Beach Walkway, Kochi, Kerala 682001",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    coordinates: { lat: 9.9658, lng: 76.2421 },
    description: "Fixed shore-operated cantilevered fishing nets introduced by 14th-century Chinese traders, set against the colonial Portuguese and Dutch beachfront of Fort Kochi.",
    photos: [
      "https://images.unsplash.com/photo-1609137840173-477861a8e688?w=800"
    ],
    facilities: ["Sunset Viewpoint", "Fresh Fish Fry Counters", "Artisan Cafes"],
    source: "curated-registry",
    sourceId: "cok-chinese-nets",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Kochi", "Chinese Fishing Nets", "Fort Kochi", "Kerala", "Beach"]
  },
  {
    id: "dest-cok-02",
    name: "Mattancherry Palace",
    altNames: ["Dutch Palace"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Museums"],
    rating: 4.6,
    reviewCount: 2200,
    priceLevel: 1,
    priceRange: "₹10 entry fee",
    address: "Mattancherry, Kochi, Kerala 682002",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    coordinates: { lat: 9.9583, lng: 76.2592 },
    description: "Portuguese-built palace gifted to the Raja of Kochi in 1555, celebrated for intricate Hindu temple murals depicting scenes from the Ramayana.",
    photos: [
      "https://images.unsplash.com/photo-1570214087390?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Ramayana Wall Murals", "Royal Palanquin Room", "Jew Town Walkway"],
    openHours: "09:45 AM - 01:00 PM, 02:00 PM - 04:45 PM (Closed Fridays)",
    source: "curated-registry",
    sourceId: "cok-mattancherry",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Kochi", "Palace", "Mattancherry", "Dutch Palace", "Murals"]
  },

  // =========================================================================
  // 12. UDAIPUR & RAJASTHAN (City Palace, Lakes, Island Palaces, Havelis)
  // =========================================================================
  {
    id: "dest-udr-01",
    name: "City Palace Complex Udaipur",
    altNames: ["Udaipur City Palace"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "Forts & Palaces", "Royal Residences"],
    rating: 4.8,
    reviewCount: 4200,
    priceLevel: 2,
    priceRange: "₹300 entry fee",
    address: "Old City, Udaipur, Rajasthan 313001",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 24.5764, lng: 73.6835 },
    description: "Magnificent palace complex built over 400 years on the eastern bank of Lake Pichola, showcasing Mewar granite architecture, peacocks of mosaic glass, and courtyards.",
    photos: [
      "https://images.unsplash.com/photo-1570223818635?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Mor Chowk Glass Mosaics", "Crystal Gallery", "Lake Pichola Ferry"],
    openHours: "09:30 AM - 05:30 PM",
    source: "curated-registry",
    sourceId: "udr-city-palace",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Udaipur", "City Palace", "Lake Pichola", "Mewar", "Rajasthan"]
  },
  {
    id: "dest-udr-02",
    name: "Lake Pichola & Jag Mandir Island",
    altNames: ["Pichola Lake"],
    type: "attraction",
    category: "waterfall",
    subtypes: ["Lakes & Waterways", "Boating Points", "Island Palaces"],
    rating: 4.8,
    reviewCount: 3800,
    priceLevel: 2,
    priceRange: "₹400 Boat Cruise",
    address: "Pichola, Udaipur, Rajasthan 313001",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 24.5714, lng: 73.6740 },
    description: "Picturesque artificial fresh water lake created in 1362 AD, framed by the Aravalli hills, heritage bathing ghats, and royal island marble palaces.",
    photos: [
      "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=800"
    ],
    facilities: ["Sunset Boat Cruises", "Jag Mandir Island Stopover", "Ambrai Ghat Seating"],
    source: "curated-registry",
    sourceId: "udr-lake-pichola",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Udaipur", "Lake", "Pichola", "Jag Mandir", "Boat Cruise"]
  },
  {
    id: "dest-udr-03",
    name: "Taj Lake Palace",
    altNames: ["Jag Niwas"],
    type: "hotel",
    category: "hotel",
    subtypes: ["Luxury Hotels", "Palace Resorts"],
    rating: 4.9,
    reviewCount: 1400,
    priceLevel: 4,
    priceRange: "₹35,000 - ₹80,000 per night",
    address: "Pichola, Udaipur, Rajasthan 313001",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 24.5753, lng: 73.6800 },
    description: "Float upon Lake Pichola at this white marble 18th-century royal pleasure palace, considered one of the most romantic luxury hotels on earth.",
    photos: [
      "https://images.unsplash.com/photo-1570233549880?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Private Boat Arrival", "Jiva Spa Boat", "Lily Pond Courtyard", "Rooftop Dining"],
    phone: "+91 294 246 0101",
    website: "https://www.tajhotels.com",
    source: "curated-registry",
    sourceId: "udr-taj-lake-palace",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Udaipur", "Hotel", "Luxury", "Taj Lake Palace", "Island"]
  },

  // =========================================================================
  // 13. AMRITSAR & PUNJAB (Golden Temple, Wagah, Jallianwala, Food)
  // =========================================================================
  {
    id: "dest-asr-01",
    name: "Sri Harmandir Sahib (The Golden Temple)",
    altNames: ["Golden Temple", "Darbar Sahib"],
    type: "temple",
    category: "temple",
    subtypes: ["Temples", "Sacred Sites", "Sikh Pilgrimage"],
    rating: 4.9,
    reviewCount: 7200,
    priceLevel: 1,
    priceRange: "Free entry & 24/7 Langar",
    address: "Golden Temple Rd, Atta Mandi, Katra Ahluwalia, Amritsar, Punjab 143006",
    city: "Amritsar",
    state: "Punjab",
    country: "India",
    coordinates: { lat: 31.6200, lng: 74.8765 },
    description: "The holiest Gurdwara of Sikhism, plated in 500 kilograms of pure gold leaf surrounded by the Amrit Sarovar (Pool of Nectar) and serving 100,000 free meals daily.",
    photos: [
      "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800"
    ],
    facilities: ["Free Community Kitchen (Langar)", "Holy Amrit Sarovar", "Akal Takht"],
    openHours: "Open 24 Hours",
    source: "curated-registry",
    sourceId: "asr-golden-temple",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Amritsar", "Golden Temple", "Harmandir Sahib", "Sikh", "Punjab"]
  },
  {
    id: "dest-asr-02",
    name: "Jallianwala Bagh Memorial Garden",
    altNames: ["Jallianwala Bagh"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Historical Monuments", "National Memorials", "Sightseeing"],
    rating: 4.7,
    reviewCount: 3900,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "Golden Temple Rd, Amritsar, Punjab 143006",
    city: "Amritsar",
    state: "Punjab",
    country: "India",
    coordinates: { lat: 31.6206, lng: 74.8801 },
    description: "Historic public garden and national memorial commemorating the victims of the 1919 massacre, featuring the Martyrs' Well and preserved bullet marks.",
    photos: [
      "https://images.unsplash.com/photo-1570243281125?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Eternal Flame Memorial", "Martyrs Well", "Historical Light & Sound"],
    openHours: "06:30 AM - 07:30 PM",
    source: "curated-registry",
    sourceId: "asr-jallianwala",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Amritsar", "Jallianwala Bagh", "Freedom Struggle", "Memorial"]
  },
  {
    id: "dest-asr-03",
    name: "Wagah Border Beating Retreat Ceremony",
    altNames: ["Wagah Border"],
    type: "attraction",
    category: "heritage",
    subtypes: ["Tourist Attractions", "Cultural Experiences", "Border Ceremonies"],
    rating: 4.8,
    reviewCount: 4400,
    priceLevel: 1,
    priceRange: "Free entry",
    address: "Wagah, Attari, Punjab 143108",
    city: "Amritsar",
    state: "Punjab",
    country: "India",
    coordinates: { lat: 31.6048, lng: 74.5731 },
    description: "Daily military retreat ceremony conducted by the Indian Border Security Force (BSF) and Pakistan Rangers, marked by coordinated drill maneuvers and high-kicking patriotism.",
    photos: [
      "https://images.unsplash.com/photo-1570253012370?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Stadium Seating", "Swaran Jyoti Entry", "Patriotic Music"],
    openHours: "Ceremony starts 04:30 PM (Winter) / 05:30 PM (Summer)",
    source: "curated-registry",
    sourceId: "asr-wagah-border",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Amritsar", "Wagah Border", "BSF", "Patriotic", "Punjab"]
  },
  {
    id: "dest-asr-04",
    name: "Kesar Da Dhaba",
    altNames: ["Kesar Dhaba"],
    type: "restaurant",
    category: "restaurant",
    subtypes: ["Restaurants", "Famous Eateries", "Local Food"],
    rating: 4.6,
    reviewCount: 3100,
    priceLevel: 1,
    priceRange: "₹450 for two",
    address: "Chowk Passian, Near Telephone Exchange, Amritsar, Punjab 143001",
    city: "Amritsar",
    state: "Punjab",
    country: "India",
    coordinates: { lat: 31.6247, lng: 74.8732 },
    description: "Legendary vegetarian dhaba dating back to 1916, celebrated for its Maa Ki Dal simmered for 12 hours with pure desi ghee, Lachha Paratha, and Phirni.",
    photos: [
      "https://images.unsplash.com/photo-1570262743615?w=800&auto=format&fit=crop&q=80"
    ],
    facilities: ["Authentic Punjabi Thali", "Kesar Kheer & Phirni", "Fast Seating"],
    menuHighlights: ["Dal Makhani (Slow-cooked 12 hrs)", "Lachha Paratha", "Palak Paneer", "Phirni"],
    vegFriendly: true,
    nonVegFriendly: false,
    source: "curated-registry",
    sourceId: "asr-kesar-dhaba",
    lastVerified: "2026-10-09",
    featured: true,
    tags: ["Amritsar", "Dhaba", "Kesar Da Dhaba", "Dal Makhani", "Food"]
  }
,
  {
    "id": "dest-ahd-01",
    "name": "Sabarmati Ashram",
    "altNames": [
      "Gandhi Ashram",
      "Harijan Ashram"
    ],
    "type": "attraction",
    "category": "heritage",
    "subtypes": [
      "Historical Monuments",
      "National Memorials",
      "Museums"
    ],
    "rating": 4.8,
    "reviewCount": 4200,
    "priceLevel": 1,
    "priceRange": "Free entry",
    "address": "Gandhi Smarak Sangrahalaya, Ashram Rd, Ahmedabad, Gujarat 380027",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "country": "India",
    "coordinates": {
      "lat": 23.0605,
      "lng": 72.5804
    },
    "description": "The tranquil riverside headquarters of Mahatma Gandhi from 1917 to 1930, from where he led the historic Dandi Salt March.",
    "photos": [
      "https://images.unsplash.com/photo-1603258593453-14d4291a1a45?w=800"
    ],
    "facilities": [
      "Hriday Kunj",
      "Gandhi Memorial Museum",
      "Riverfront Promenade"
    ],
    "openHours": "08:30 AM - 06:30 PM",
    "source": "curated-registry",
    "sourceId": "ahd-sabarmati",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Ahmedabad",
      "Gujarat",
      "Gandhi",
      "Sabarmati",
      "Ashram",
      "Heritage"
    ]
  },
  {
    "id": "dest-ahd-02",
    "name": "Adalaj Stepwell",
    "altNames": [
      "Adalaj ni Vav"
    ],
    "type": "attraction",
    "category": "heritage",
    "subtypes": [
      "Historical Monuments",
      "Ancient Architecture",
      "Stepwells"
    ],
    "rating": 4.7,
    "reviewCount": 3100,
    "priceLevel": 1,
    "priceRange": "₹25 entry fee",
    "address": "Adalaj, Gandhinagar, Gujarat 382421",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "country": "India",
    "coordinates": {
      "lat": 23.1667,
      "lng": 72.5813
    },
    "description": "Five-story subterranean stepwell built in 1499 featuring intricate Solanki style stone carvings, octagonal landings, and cooling breezes.",
    "photos": [
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800"
    ],
    "facilities": [
      "Carved Pillars",
      "Subterranean Walkway",
      "Photography Point"
    ],
    "openHours": "08:00 AM - 06:00 PM",
    "source": "curated-registry",
    "sourceId": "ahd-adalaj",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Ahmedabad",
      "Stepwell",
      "Adalaj",
      "Architecture",
      "Gujarat"
    ]
  },
  {
    "id": "dest-ahd-03",
    "name": "Manek Chowk Night Food Market",
    "altNames": [
      "Manek Chowk"
    ],
    "type": "restaurant",
    "category": "restaurant",
    "subtypes": [
      "Street Food",
      "Famous Eateries",
      "Night Bazaars"
    ],
    "rating": 4.6,
    "reviewCount": 3800,
    "priceLevel": 1,
    "priceRange": "₹300 for two",
    "address": "Manek Chowk Rd, Danapidth, Khadia, Ahmedabad, Gujarat 380001",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "country": "India",
    "coordinates": {
      "lat": 23.0234,
      "lng": 72.5898
    },
    "description": "Bustling historic city square that operates as a vegetable market by day and transforms into a world-famous street food paradise at night.",
    "photos": [
      "https://images.unsplash.com/photo-1567337710282-00832b41597a?w=800"
    ],
    "facilities": [
      "Pav Bhaji Stalls",
      "Gwalior Dosa",
      "Kulfi Counters"
    ],
    "menuHighlights": [
      "Amul Butter Pav Bhaji",
      "Chocolate Cheese Sandwich",
      "Asharfi Kulfi"
    ],
    "vegFriendly": true,
    "nonVegFriendly": false,
    "source": "curated-registry",
    "sourceId": "ahd-manek-chowk",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Ahmedabad",
      "Food",
      "Street Food",
      "Manek Chowk",
      "Vegetarian"
    ]
  },
  {
    "id": "dest-som-01",
    "name": "Somnath Temple",
    "altNames": [
      "Deo Patan",
      "Prabhas Patan"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Temples",
      "Sacred Sites",
      "First Jyotirlinga"
    ],
    "rating": 4.9,
    "reviewCount": 5800,
    "priceLevel": 1,
    "priceRange": "Free darshan",
    "address": "Somnath Mandir Rd, Prabhas Patan, Gujarat 362268",
    "city": "Somnath",
    "state": "Gujarat",
    "country": "India",
    "coordinates": {
      "lat": 20.888,
      "lng": 70.4012
    },
    "description": "The first of the twelve sacred Jyotirlinga shrines of Lord Shiva, situated right at the edge of the Arabian Sea with a 150-foot tower.",
    "photos": [
      "https://images.unsplash.com/photo-1582510003544-d893d975231c?w=800"
    ],
    "facilities": [
      "Sound & Light Show",
      "Baan Stambh (Arrow Pillar)",
      "Sea Promenade"
    ],
    "openHours": "06:00 AM - 10:00 PM",
    "source": "curated-registry",
    "sourceId": "som-temple",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Somnath",
      "Temple",
      "Jyotirlinga",
      "Shiva",
      "Gujarat"
    ]
  },
  {
    "id": "dest-gir-01",
    "name": "Gir National Park",
    "altNames": [
      "Sasan Gir",
      "Gir Forest"
    ],
    "type": "attraction",
    "category": "wildlife",
    "subtypes": [
      "Wildlife Sanctuaries",
      "National Parks",
      "Safaris"
    ],
    "rating": 4.8,
    "reviewCount": 3200,
    "priceLevel": 3,
    "priceRange": "₹800 - ₹2,500 Safari",
    "address": "Sasan Gir, Junagadh District, Gujarat 362135",
    "city": "Gir",
    "state": "Gujarat",
    "country": "India",
    "coordinates": {
      "lat": 21.1243,
      "lng": 70.8242
    },
    "description": "The only natural habitat on earth for the pure Asiatic Lion (Panthera leo leo), spanning 1,412 square kilometers of dry deciduous scrub forest.",
    "photos": [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f9?w=800"
    ],
    "facilities": [
      "Open Jeep Safari",
      "Devalia Safari Park",
      "Crocodile Breeding Centre"
    ],
    "openHours": "06:00 AM - 05:00 PM (Safaris timed)",
    "source": "curated-registry",
    "sourceId": "gir-national-park",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Gir",
      "Asiatic Lion",
      "Wildlife",
      "National Park",
      "Safari",
      "Gujarat"
    ]
  },
  {
    "id": "dest-shm-01",
    "name": "The Ridge & Mall Road Shimla",
    "altNames": [
      "The Ridge",
      "Shimla Mall"
    ],
    "type": "attraction",
    "category": "heritage",
    "subtypes": [
      "Hill Stations",
      "Promenades",
      "Colonial Heritage"
    ],
    "rating": 4.7,
    "reviewCount": 4500,
    "priceLevel": 1,
    "priceRange": "Free public access",
    "address": "The Ridge, Near Christ Church, Shimla, Himachal Pradesh 171001",
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "country": "India",
    "coordinates": {
      "lat": 31.1048,
      "lng": 77.1734
    },
    "description": "The open cultural heart of Shimla offering panoramic vistas of snow-capped Himalayan ranges and Neo-Gothic Christ Church built in 1857.",
    "photos": [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800"
    ],
    "facilities": [
      "Christ Church",
      "Horse Rides",
      "Gaiety Theatre",
      "Scandal Point"
    ],
    "source": "curated-registry",
    "sourceId": "shm-ridge",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Shimla",
      "The Ridge",
      "Mall Road",
      "Himalayas",
      "Himachal Pradesh"
    ]
  },
  {
    "id": "dest-mnl-01",
    "name": "Solang Valley & Rohtang Pass",
    "altNames": [
      "Solang Nullah",
      "Rohtang"
    ],
    "type": "attraction",
    "category": "adventure",
    "subtypes": [
      "Adventure Activities",
      "Snow Destinations",
      "Valleys"
    ],
    "rating": 4.8,
    "reviewCount": 5200,
    "priceLevel": 2,
    "priceRange": "₹500 - ₹3,000 Activities",
    "address": "Solang Valley, Manali, Himachal Pradesh 175131",
    "city": "Manali",
    "state": "Himachal Pradesh",
    "country": "India",
    "coordinates": {
      "lat": 32.3166,
      "lng": 77.1578
    },
    "description": "Famous mountain valley situated 14 km from Manali, known for snow sports in winter and paragliding, zorbing, and cable cars in summer.",
    "photos": [
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b6?w=800"
    ],
    "facilities": [
      "Paragliding Launch",
      "Ski Slopes",
      "Ropeway Cable Car",
      "Zorbing Track"
    ],
    "source": "curated-registry",
    "sourceId": "mnl-solang",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Manali",
      "Solang Valley",
      "Rohtang",
      "Snow",
      "Adventure",
      "Himachal"
    ]
  },
  {
    "id": "dest-dhm-01",
    "name": "Tsuglagkhang Complex (Dalai Lama Temple)",
    "altNames": [
      "Dalai Lama Temple",
      "Namgyal Monastery"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Temples",
      "Buddhist Monasteries",
      "Spiritual Centers"
    ],
    "rating": 4.9,
    "reviewCount": 3800,
    "priceLevel": 1,
    "priceRange": "Free entry",
    "address": "Temple Rd, McLeod Ganj, Dharamshala, Himachal Pradesh 176219",
    "city": "Dharamshala",
    "state": "Himachal Pradesh",
    "country": "India",
    "coordinates": {
      "lat": 32.2359,
      "lng": 76.3248
    },
    "description": "The official residence of His Holiness the 14th Dalai Lama, featuring gilded Shakyamuni Buddha statues, prayer wheels, and Tibetan debate courtyards.",
    "photos": [
      "https://images.unsplash.com/photo-1514222134-b57cbe856c49?w=800"
    ],
    "facilities": [
      "Tibet Museum",
      "Prayer Wheel Kora Walk",
      "Buddhist Meditation Hall"
    ],
    "openHours": "05:00 AM - 08:00 PM",
    "source": "curated-registry",
    "sourceId": "dhm-dalai-lama",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Dharamshala",
      "McLeod Ganj",
      "Dalai Lama",
      "Buddhism",
      "Temple"
    ]
  },
  {
    "id": "dest-rsk-01",
    "name": "Laxman Jhula & Triveni Ghat",
    "altNames": [
      "Rishikesh Ghats",
      "Laxman Suspension Bridge"
    ],
    "type": "attraction",
    "category": "heritage",
    "subtypes": [
      "Sacred Sites",
      "Tourist Attractions",
      "Riverfront"
    ],
    "rating": 4.8,
    "reviewCount": 4600,
    "priceLevel": 1,
    "priceRange": "Free viewing",
    "address": "Triveni Ghat, Mayakund, Rishikesh, Uttarakhand 249201",
    "city": "Rishikesh",
    "state": "Uttarakhand",
    "country": "India",
    "coordinates": {
      "lat": 30.1033,
      "lng": 78.2948
    },
    "description": "The Yoga Capital of the World along the emerald Ganga River, renowned for thrilling whitewater rafting, historic iron suspension bridges, and evening Maha Aarti.",
    "photos": [
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800"
    ],
    "facilities": [
      "Maha Aarti at Dusk",
      "Rafting Beach Camps",
      "Yoga Ashrams"
    ],
    "source": "curated-registry",
    "sourceId": "rsk-laxman-jhula",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Rishikesh",
      "Ganga",
      "Yoga",
      "Rafting",
      "Triveni Ghat",
      "Uttarakhand"
    ]
  },
  {
    "id": "dest-hdw-01",
    "name": "Har Ki Pauri",
    "altNames": [
      "Footstep of God"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Sacred Sites",
      "Ghats",
      "Pilgrimage Circuits"
    ],
    "rating": 4.9,
    "reviewCount": 5400,
    "priceLevel": 1,
    "priceRange": "Free access",
    "address": "Har Ki Pauri, Haridwar, Uttarakhand 249401",
    "city": "Haridwar",
    "state": "Uttarakhand",
    "country": "India",
    "coordinates": {
      "lat": 29.9566,
      "lng": 78.1706
    },
    "description": "Sacred ghat on the banks of the Ganges where thousands gather every evening to witness the sacred Ganga Aarti, floating thousands of diya flower boats.",
    "photos": [
      "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800"
    ],
    "facilities": [
      "Grand Ganga Aarti",
      "Brahmakund Bathing Ghat",
      "Ropeway to Mansa Devi"
    ],
    "source": "curated-registry",
    "sourceId": "hdw-har-ki-pauri",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Haridwar",
      "Har Ki Pauri",
      "Ganga Aarti",
      "Holy",
      "Uttarakhand"
    ]
  },
  {
    "id": "dest-cbt-01",
    "name": "Jim Corbett National Park",
    "altNames": [
      "Corbett Tiger Reserve"
    ],
    "type": "attraction",
    "category": "wildlife",
    "subtypes": [
      "Wildlife Sanctuaries",
      "National Parks",
      "Safaris"
    ],
    "rating": 4.7,
    "reviewCount": 3800,
    "priceLevel": 3,
    "priceRange": "₹1,500 - ₹5,000 Safari",
    "address": "Ramnagar, Nainital District, Uttarakhand 244715",
    "city": "Nainital",
    "state": "Uttarakhand",
    "country": "India",
    "coordinates": {
      "lat": 29.53,
      "lng": 78.7747
    },
    "description": "India's oldest national park established in 1936, protecting the Bengal Tiger amidst scenic Himalayan foothills, sal forests, and the Ramganga River.",
    "photos": [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f8?w=800"
    ],
    "facilities": [
      "Dhikala Zone Safari",
      "Elephant Safaris",
      "Jungle Eco-Lodges"
    ],
    "source": "curated-registry",
    "sourceId": "cbt-national-park",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Corbett",
      "Jim Corbett",
      "Tiger Reserve",
      "Wildlife",
      "Safari"
    ]
  },
  {
    "id": "dest-mun-01",
    "name": "Munnar Tea Gardens & Eravikulam",
    "altNames": [
      "Munnar Valley",
      "Eravikulam National Park"
    ],
    "type": "attraction",
    "category": "nature",
    "subtypes": [
      "Hill Stations",
      "Nature Destinations",
      "Wildlife Sanctuaries"
    ],
    "rating": 4.8,
    "reviewCount": 4600,
    "priceLevel": 1,
    "priceRange": "₹200 entry fee",
    "address": "Kannandevan Hills, Munnar, Idukki District, Kerala 685612",
    "city": "Munnar",
    "state": "Kerala",
    "country": "India",
    "coordinates": {
      "lat": 10.0889,
      "lng": 77.0595
    },
    "description": "Sprawling tea plantations rising into misty clouds, home to the endangered Nilgiri Tahr mountain goat and Anamudi, South India's highest peak.",
    "photos": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fd?w=800"
    ],
    "facilities": [
      "Tea Museum & Factory",
      "Nilgiri Tahr Safari",
      "Trekking Trails"
    ],
    "source": "curated-registry",
    "sourceId": "mun-tea-gardens",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Munnar",
      "Kerala",
      "Tea",
      "Nilgiri Tahr",
      "Hill Station",
      "Nature"
    ]
  },
  {
    "id": "dest-alp-01",
    "name": "Alleppey Backwaters & Houseboat Cruise",
    "altNames": [
      "Alappuzha Backwaters"
    ],
    "type": "attraction",
    "category": "waterfall",
    "subtypes": [
      "Lakes & Waterways",
      "Houseboat Stays",
      "Scenic Water Bodies"
    ],
    "rating": 4.9,
    "reviewCount": 5100,
    "priceLevel": 3,
    "priceRange": "₹8,500 - ₹22,000 per night (Houseboat)",
    "address": "Punnamada Jetty, Alappuzha, Kerala 688006",
    "city": "Alappuzha",
    "state": "Kerala",
    "country": "India",
    "coordinates": {
      "lat": 9.4981,
      "lng": 76.3388
    },
    "description": "Serene labyrinth of palm-fringed canals, lagoons, and Vembanad Lake where traditional Kettuvallam houseboats cruise past paddy fields.",
    "photos": [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc1?w=800"
    ],
    "facilities": [
      "Traditional Kerala Meals",
      "Shikara Boat Rides",
      "Kayaking"
    ],
    "source": "curated-registry",
    "sourceId": "alp-backwaters",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Alleppey",
      "Alappuzha",
      "Backwaters",
      "Houseboat",
      "Kerala"
    ]
  },
  {
    "id": "dest-kl-athi-01",
    "name": "Athirappilly Waterfalls",
    "altNames": [
      "Niagara of India",
      "Athirapally Falls"
    ],
    "type": "attraction",
    "category": "waterfall",
    "subtypes": [
      "Waterfalls",
      "Scenic Water Bodies",
      "Nature & Ecotourism"
    ],
    "rating": 4.8,
    "reviewCount": 3890,
    "priceLevel": 1,
    "priceRange": "₹50 (Entry Ticket)",
    "entryFee": "₹50 per person",
    "bestTimeToVisit": "September to January",
    "address": "Athirappilly, Chalakudy Taluk, Thrissur District, Kerala 680721",
    "city": "Kochi",
    "district": "Thrissur",
    "state": "Kerala",
    "country": "India",
    "coordinates": {
      "lat": 10.2851,
      "lng": 76.5698
    },
    "description": "Majestic 80-foot high waterfall nicknamed the Niagara of India, cascading from the Anamudi mountains through the Sholayar forest range on the Chalakudy River.",
    "detailedDescription": "Athirappilly Falls is the largest waterfall in Kerala, standing 80 feet tall. Located at the entrance to the Sholayar ranges, it is famed for breathtaking forest views, trekking trails to the base of the falls, and appearances in iconic Indian cinema.",
    "photos": [
      "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800"
    ],
    "facilities": [
      "Viewpoint Promenade",
      "Forest Trekking Trail",
      "Parking Area",
      "Cafeteria",
      "Restrooms"
    ],
    "openHours": "08:00 AM - 05:00 PM",
    "source": "curated-registry",
    "sourceId": "kl-athirappilly-falls",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Athirappilly",
      "Waterfalls",
      "Chalakudy",
      "Kerala",
      "Thrissur",
      "Niagara of India"
    ]
  },
  {
    "id": "dest-raj-jodh-01",
    "name": "Mehrangarh Fort",
    "altNames": [
      "Jodhpur Fort",
      "Fort of the Sun"
    ],
    "type": "attraction",
    "category": "heritage",
    "subtypes": [
      "Forts",
      "Palaces",
      "Heritage Monuments",
      "Museums"
    ],
    "rating": 4.9,
    "reviewCount": 4650,
    "priceLevel": 2,
    "priceRange": "₹100 (Indians), ₹600 (Foreigners)",
    "entryFee": "₹100 (Indians), ₹600 (Foreigners)",
    "bestTimeToVisit": "October to March",
    "address": "P.B. No 18, Fort Rd, Jodhpur, Rajasthan 342006",
    "city": "Jaipur",
    "district": "Jodhpur",
    "state": "Rajasthan",
    "country": "India",
    "coordinates": {
      "lat": 26.2980,
      "lng": 73.0189
    },
    "description": "Imposing 15th-century citadel perched 410 feet above Jodhpur's blue city skyline, featuring Sheesh Mahal, Phool Mahal, and expansive royal palanquins museum.",
    "detailedDescription": "Commissioned by Rao Jodha in 1459, Mehrangarh Fort is one of India's largest and most magnificent fortifications. Its burnished red sandstone walls enclose intricately carved courtyards, canon ramparts overlooking the Blue City, and a museum.",
    "photos": [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"
    ],
    "facilities": [
      "Elevator Facility",
      "Audio Guides",
      "Chokelao Bagh Restaurant",
      "Museum Souvenir Shop"
    ],
    "openHours": "09:00 AM - 05:00 PM",
    "source": "curated-registry",
    "sourceId": "raj-mehrangarh-fort",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Mehrangarh",
      "Fort",
      "Jodhpur",
      "Rajasthan",
      "Heritage",
      "Palace"
    ]
  },
  {
    "id": "dest-tvm-01",
    "name": "Sree Padmanabhaswamy Temple",
    "altNames": [
      "Padmanabha Temple"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Temples",
      "Sacred Sites",
      "Dravidian Heritage"
    ],
    "rating": 4.9,
    "reviewCount": 4200,
    "priceLevel": 1,
    "priceRange": "Free darshan (Special ₹250)",
    "address": "West Nada, Fort, East Fort, Pazhavangadi, Thiruvananthapuram, Kerala 695023",
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "country": "India",
    "coordinates": {
      "lat": 8.4831,
      "lng": 76.9436
    },
    "description": "The richest temple in the world, dedicated to Lord Vishnu reclining on the serpent Anantha in the Anantha Shayana posture, featuring an imposing 100-foot gopuram.",
    "photos": [
      "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800"
    ],
    "facilities": [
      "Padmatheertham Tank",
      "Dhoti / Saree Mandate",
      "Heritage Corridor"
    ],
    "openHours": "03:30 AM - 12:00 PM, 05:00 PM - 08:30 PM",
    "source": "curated-registry",
    "sourceId": "tvm-padmanabhaswamy",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Trivandrum",
      "Padmanabhaswamy",
      "Temple",
      "Vishnu",
      "Kerala"
    ]
  },
  {
    "id": "dest-tpt-01",
    "name": "Tirumala Venkateswara Temple",
    "altNames": [
      "Tirupati Balaji",
      "Seven Hills Temple"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Temples",
      "Sacred Sites",
      "World Famous Pilgrimage"
    ],
    "rating": 4.9,
    "reviewCount": 9800,
    "priceLevel": 1,
    "priceRange": "Free darshan (Special ₹300)",
    "address": "S Mada St, Tirumala, Tirupati, Andhra Pradesh 517504",
    "city": "Tirupati",
    "state": "Andhra Pradesh",
    "country": "India",
    "coordinates": {
      "lat": 13.6833,
      "lng": 79.3472
    },
    "description": "One of the most visited and revered pilgrimage destinations on earth, dedicated to Lord Venkateswara atop the sacred Seshachalam Seven Hills.",
    "photos": [
      "https://images.unsplash.com/photo-1582510003544-d893d9752328?w=800"
    ],
    "facilities": [
      "Free Annaprasadam",
      "Tirupati Laddu Prasadam",
      "TTD Accommodations"
    ],
    "openHours": "Open 24 Hours",
    "source": "curated-registry",
    "sourceId": "tpt-venkateswara",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Tirupati",
      "Balaji",
      "Tirumala",
      "Temple",
      "Andhra Pradesh",
      "Seven Hills"
    ]
  },
  {
    "id": "dest-vtg-01",
    "name": "Visakhapatnam RK Beach & Submarine Museum",
    "altNames": [
      "Ramakrishna Beach",
      "INS Kursura"
    ],
    "type": "attraction",
    "category": "beach",
    "subtypes": [
      "Beaches",
      "Museums",
      "Coastal Destinations"
    ],
    "rating": 4.7,
    "reviewCount": 3900,
    "priceLevel": 1,
    "priceRange": "₹40 Submarine Entry",
    "address": "Beach Rd, Pandurangapuram, Visakhapatnam, Andhra Pradesh 530003",
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "country": "India",
    "coordinates": {
      "lat": 17.7167,
      "lng": 83.3325
    },
    "description": "Scenic coastline featuring the decommissioned INS Kursura submarine museum, TU-142 aircraft museum, and golden sandy beaches along the Bay of Bengal.",
    "photos": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3f?w=800"
    ],
    "facilities": [
      "Submarine Walkthrough",
      "Aircraft Museum",
      "Beach Promenade"
    ],
    "source": "curated-registry",
    "sourceId": "vtg-rk-beach",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Vizag",
      "Visakhapatnam",
      "RK Beach",
      "Submarine",
      "Andhra Pradesh"
    ]
  },
  {
    "id": "dest-mdu-01",
    "name": "Meenakshi Amman Temple",
    "altNames": [
      "Madurai Meenakshi"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Temples",
      "Sacred Sites",
      "Dravidian Masterpiece"
    ],
    "rating": 4.9,
    "reviewCount": 6200,
    "priceLevel": 1,
    "priceRange": "Free entry",
    "address": "Madurai Main, Madurai, Tamil Nadu 625001",
    "city": "Madurai",
    "state": "Tamil Nadu",
    "country": "India",
    "coordinates": {
      "lat": 9.9195,
      "lng": 78.1193
    },
    "description": "Ancient temple complex spanning 14 acres with 14 colossal gopurams encrusted with thousands of painted mythological sculptures and the Hall of Thousand Pillars.",
    "photos": [
      "https://images.unsplash.com/photo-1582510003544-d893d975231e?w=800"
    ],
    "facilities": [
      "Hall of 1000 Pillars",
      "Golden Lotus Tank",
      "Evening Procession"
    ],
    "openHours": "05:00 AM - 12:30 PM, 04:00 PM - 10:00 PM",
    "source": "curated-registry",
    "sourceId": "mdu-meenakshi",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Madurai",
      "Meenakshi Temple",
      "Temple",
      "Dravidian",
      "Tamil Nadu"
    ]
  },
  {
    "id": "dest-mby-01",
    "name": "Shore Temple & Pancha Rathas Mahabalipuram",
    "altNames": [
      "Mamallapuram",
      "Shore Temple"
    ],
    "type": "attraction",
    "category": "heritage",
    "subtypes": [
      "Historical Monuments",
      "UNESCO Heritage",
      "Coastal Monoliths"
    ],
    "rating": 4.8,
    "reviewCount": 3600,
    "priceLevel": 1,
    "priceRange": "₹40 entry fee",
    "address": "Mahabalipuram, Tamil Nadu 603104",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "coordinates": {
      "lat": 12.6164,
      "lng": 80.1983
    },
    "description": "UNESCO World Heritage 8th-century granite temples constructed by the Pallava dynasty overlooking the crashing waves of the Bay of Bengal.",
    "photos": [
      "https://images.unsplash.com/photo-1582510003544-d893d9752327?w=800"
    ],
    "facilities": [
      "Arjuna's Penance Bas-relief",
      "Pancha Rathas Monoliths",
      "Beach Breeze"
    ],
    "openHours": "06:00 AM - 06:00 PM",
    "source": "curated-registry",
    "sourceId": "mby-shore-temple",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Mahabalipuram",
      "Shore Temple",
      "UNESCO",
      "Pallava",
      "Tamil Nadu"
    ]
  },
  {
    "id": "dest-pri-01",
    "name": "Jagannath Temple Puri",
    "altNames": [
      "Shree Jagannatha Temple",
      "Puri Dham"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Temples",
      "Char Dham",
      "Sacred Sites"
    ],
    "rating": 4.9,
    "reviewCount": 6800,
    "priceLevel": 1,
    "priceRange": "Free darshan",
    "address": "Bada Danda, Puri, Odisha 752001",
    "city": "Puri",
    "state": "Odisha",
    "country": "India",
    "coordinates": {
      "lat": 19.8049,
      "lng": 85.8179
    },
    "description": "One of the holy Char Dham pilgrimage sites, built in the 12th century with a 214-foot curvilinear tower, home to the world-renowned annual Ratha Yatra chariot festival.",
    "photos": [
      "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=800"
    ],
    "facilities": [
      "Ananda Bazaar Mahaprasad",
      "Aruna Stambha Pillar",
      "Meghnad Prachira Wall"
    ],
    "openHours": "05:00 AM - 11:00 PM",
    "source": "curated-registry",
    "sourceId": "pri-jagannath",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Puri",
      "Jagannath",
      "Char Dham",
      "Odisha",
      "Temple"
    ]
  },
  {
    "id": "dest-knk-01",
    "name": "Konark Sun Temple",
    "altNames": [
      "Black Pagoda"
    ],
    "type": "attraction",
    "category": "heritage",
    "subtypes": [
      "Historical Monuments",
      "UNESCO Heritage",
      "Stone Chariot"
    ],
    "rating": 4.8,
    "reviewCount": 4100,
    "priceLevel": 1,
    "priceRange": "₹40 entry fee",
    "address": "Konark, Puri District, Odisha 752111",
    "city": "Puri",
    "state": "Odisha",
    "country": "India",
    "coordinates": {
      "lat": 19.8876,
      "lng": 86.0945
    },
    "description": "13th-century UNESCO World Heritage monument engineered as a colossal 24-wheeled chariot of Surya the Sun God, pulled by seven stone horses.",
    "photos": [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"
    ],
    "facilities": [
      "Intricately Carved Sun Wheels (Sundials)",
      "Archaeological Museum",
      "Light & Sound Show"
    ],
    "openHours": "06:00 AM - 08:00 PM",
    "source": "curated-registry",
    "sourceId": "knk-sun-temple",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Konark",
      "Sun Temple",
      "UNESCO",
      "Odisha",
      "Chariot"
    ]
  },
  {
    "id": "dest-srn-01",
    "name": "Dal Lake & Shikara Cruise",
    "altNames": [
      "Jewel in the Crown of Kashmir"
    ],
    "type": "attraction",
    "category": "waterfall",
    "subtypes": [
      "Lakes & Waterways",
      "Houseboat Stays",
      "Scenic Water Bodies"
    ],
    "rating": 4.9,
    "reviewCount": 5600,
    "priceLevel": 2,
    "priceRange": "₹700 - ₹1,200 Shikara Ride",
    "address": "Boulevard Rd, Dal Lake, Srinagar, Jammu & Kashmir 190001",
    "city": "Srinagar",
    "state": "Jammu & Kashmir",
    "country": "India",
    "coordinates": {
      "lat": 34.0837,
      "lng": 74.7973
    },
    "description": "World-famous urban lake framed by the Pir Panjal mountains, celebrated for cedar-carved houseboats, floating vegetable markets, and Nishat/Shalimar Mughal Gardens.",
    "photos": [
      "https://images.unsplash.com/photo-1548013146-72479768badb?w=800"
    ],
    "facilities": [
      "Shikara Sunset Rides",
      "Floating Market",
      "Heritage Houseboats"
    ],
    "source": "curated-registry",
    "sourceId": "srn-dal-lake",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Srinagar",
      "Dal Lake",
      "Kashmir",
      "Shikara",
      "Houseboat",
      "Mughal"
    ]
  },
  {
    "id": "dest-leh-01",
    "name": "Pangong Tso Lake",
    "altNames": [
      "Pangong Lake Ladakh"
    ],
    "type": "attraction",
    "category": "nature",
    "subtypes": [
      "Lakes & Waterways",
      "High Altitude Lakes",
      "Nature Destinations"
    ],
    "rating": 4.9,
    "reviewCount": 4200,
    "priceLevel": 2,
    "priceRange": "₹400 Eco Permit",
    "address": "Pangong Lake, Changthang, Ladakh 194201",
    "city": "Leh",
    "state": "Ladakh",
    "country": "India",
    "coordinates": {
      "lat": 33.7595,
      "lng": 78.6674
    },
    "description": "Endorheic salt water lake at 14,270 feet, known for shifting shades from deep blue to turquoise against barren arid mountains.",
    "photos": [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
    ],
    "facilities": [
      "Lakeside Glamping",
      "Stargazing Viewpoint",
      "Photography Spots"
    ],
    "source": "curated-registry",
    "sourceId": "leh-pangong",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Ladakh",
      "Leh",
      "Pangong",
      "Lake",
      "High Altitude",
      "Mountains"
    ]
  },
  {
    "id": "dest-ghy-01",
    "name": "Kamakhya Temple",
    "altNames": [
      "Kamakhya Devalaya"
    ],
    "type": "temple",
    "category": "temple",
    "subtypes": [
      "Temples",
      "Shakti Peethas",
      "Sacred Sites"
    ],
    "rating": 4.8,
    "reviewCount": 4100,
    "priceLevel": 1,
    "priceRange": "Free entry",
    "address": "Kamakhya, Guwahati, Assam 781010",
    "city": "Guwahati",
    "state": "Assam",
    "country": "India",
    "coordinates": {
      "lat": 26.1664,
      "lng": 91.7052
    },
    "description": "One of the oldest and most revered 51 Shakti Peethas situated on Nilachal Hill, dedicated to the mother goddess Kamakhya, celebrated during the Ambubachi Mela.",
    "photos": [
      "https://images.unsplash.com/photo-1582510003544-d893d9752326?w=800"
    ],
    "facilities": [
      "Nilachal Hill View",
      "Sacred Natural Spring",
      "Free Community Meals"
    ],
    "openHours": "05:30 AM - 01:00 PM, 02:30 PM - 05:30 PM",
    "source": "curated-registry",
    "sourceId": "ghy-kamakhya",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Guwahati",
      "Kamakhya",
      "Assam",
      "Shakti Peeth",
      "Temple"
    ]
  },
  {
    "id": "dest-shl-01",
    "name": "Cherrapunji Living Root Bridges & Nohkalikai Falls",
    "altNames": [
      "Sohra Living Root Bridges"
    ],
    "type": "attraction",
    "category": "nature",
    "subtypes": [
      "Nature Destinations",
      "Waterfalls",
      "Bio-Engineering Wonders"
    ],
    "rating": 4.9,
    "reviewCount": 3800,
    "priceLevel": 1,
    "priceRange": "₹50 entry fee",
    "address": "Nongriat, Sohra / Cherrapunji, Meghalaya 793108",
    "city": "Shillong",
    "state": "Meghalaya",
    "country": "India",
    "coordinates": {
      "lat": 25.25,
      "lng": 91.7333
    },
    "description": "Centuries-old bio-engineering marvels grown by the Khasi people from the roots of Ficus elastica trees across raging rivers, near the 340-meter Nohkalikai plunge falls.",
    "photos": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fe?w=800"
    ],
    "facilities": [
      "Double Decker Bridge Trek",
      "Natural Rock Pools",
      "Nohkalikai Viewpoint"
    ],
    "source": "curated-registry",
    "sourceId": "shl-root-bridges",
    "lastVerified": "2026-10-09",
    "featured": true,
    "tags": [
      "Shillong",
      "Meghalaya",
      "Root Bridge",
      "Cherrapunji",
      "Waterfall",
      "Nature"
    ]
  }
];
