import { Place, CityInfo } from "../models/types";
import { CITY_LANDMARK_REGISTRY, getCityHeroImage, getPlacePhotos } from "./imageService";

export interface CuratedCityEntry {
  city: CityInfo;
  places: Place[];
  aliases: string[];
}

export const CURATED_CITIES: Record<string, CuratedCityEntry> = {
  hyderabad: {
    aliases: ["hyderabad", "secunderabad", "bhagyanagar", "cyberabad"],
    city: {
      name: "Hyderabad",
      state: "Telangana",
      lat: 17.3850,
      lng: 78.4867,
      image: CITY_LANDMARK_REGISTRY.hyderabad.hero,
      description: "The City of Pearls and Nizami heritage, world-famous for the iconic Charminar, massive Golconda Fort, and authentic Dum Biryani."
    },
    places: [
      {
        id: "p-hyd-1",
        name: "Charminar",
        type: "attraction",
        subtypes: ["Historical Monument", "Nizami Heritage"],
        rating: 4.8,
        reviewCount: 3420,
        priceLevel: 1,
        priceRange: "₹25 entry fee",
        address: "Charminar Rd, Char Kaman, Ghansi Bazaar, Hyderabad, Telangana 500002",
        description: "The legendary 1591 monument with four grand arches and minarets soaring 48 meters, surrounded by bustling pearl markets and Laad Bazaar bangle shops.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["charminar"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["charminar"][1]
        ],
        facilities: ["Historic Viewpoint", "Night Lighting", "Heritage Walks", "Bazaar Access"],
        coordinates: { lat: 17.3616, lng: 78.4747 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-hyd-2",
        name: "Golconda Fort",
        type: "attraction",
        subtypes: ["Medieval Fortress", "Archaeological Wonder"],
        rating: 4.7,
        reviewCount: 2890,
        priceLevel: 1,
        priceRange: "₹25 - ₹100 sound & light",
        address: "Ibrahim Bagh, Hyderabad, Telangana 500008",
        description: "Spectacular medieval fortress celebrated for its acoustic architecture where a handclap at the entrance echoes 1 kilometer away atop the Bala Hissar pavilion.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["golconda fort"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["golconda fort"][1]
        ],
        facilities: ["Sound & Light Show", "Acoustics Tour", "Cannon Battery", "Panoramic View"],
        coordinates: { lat: 17.3833, lng: 78.4011 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-hyd-3",
        name: "Hussain Sagar & Monolithic Buddha",
        type: "attraction",
        subtypes: ["Lake Promenade", "Statue & Boating"],
        rating: 4.6,
        reviewCount: 2150,
        priceLevel: 1,
        priceRange: "₹50 - ₹120 boat ride",
        address: "Necklace Road / Tank Bund, Hyderabad, Telangana 500004",
        description: "Heart-shaped historic lake featuring the world's tallest monolithic granite Buddha statue standing 18 meters tall in the center of the lake.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["hussain sagar"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["buddha statue"][0]
        ],
        facilities: ["Speedboat Cruise", "Ferry Boat to Island", "Musical Fountains", "Sunset Walkways"],
        coordinates: { lat: 17.4239, lng: 78.4738 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-hyd-4",
        name: "Taj Falaknuma Palace",
        type: "hotel",
        subtypes: ["Palace Hotel", "Heritage Luxury"],
        rating: 4.9,
        reviewCount: 1680,
        priceLevel: 4,
        priceRange: "₹38,000 - ₹85,000 / night",
        address: "Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad, Telangana 500053",
        description: "Former palace of the Nizam of Hyderabad converted into a world-class luxury retreat 2,000 feet above the city, featuring Italian marble and Venetian chandeliers.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["taj falaknuma palace"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["taj falaknuma palace"][1]
        ],
        facilities: ["Horse Carriage Arrival", "Royal Dining Hall", "Jiva Spa", "Library", "Swimming Pool"],
        coordinates: { lat: 17.3314, lng: 78.4674 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-hyd-5",
        name: "Salar Jung Museum",
        type: "attraction",
        subtypes: ["National Art Museum", "Antiquities"],
        rating: 4.7,
        reviewCount: 2450,
        priceLevel: 1,
        priceRange: "₹50 entry fee",
        address: "Salar Jung Rd, Darulshifa, Hyderabad, Telangana 500002",
        description: "One of the three National Museums of India housing the vast single-man collection of Nawab Mir Yousuf Ali Khan, including the famous Veiled Rebecca and Musical Clock.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["salar jung museum"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["salar jung museum"][1]
        ],
        facilities: ["Audio Guide", "Rare Manuscripts", "Mughal Jade", "AC Galleries"],
        coordinates: { lat: 17.3713, lng: 78.4804 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-hyd-6",
        name: "Birla Mandir Hyderabad",
        type: "temple",
        subtypes: ["Marble Shrine", "Hilltop Temple"],
        rating: 4.8,
        reviewCount: 3100,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "Hill Fort Rd, Ambedkar Colony, Khairtabad, Hyderabad, Telangana 500004",
        description: "Majestic Hindu temple built entirely from 2,000 tonnes of pure white Rajasthani marble atop the 280-foot high Naubat Pahad hill, overlooking Hussain Sagar.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["birla mandir"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["birla mandir"][1]
        ],
        facilities: ["Panoramic City View", "Peaceful Meditation", "Shoe Counter", "Evening Illumination"],
        coordinates: { lat: 17.4062, lng: 78.4691 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-hyd-7",
        name: "Paradise Biryani & Nizami Kitchen",
        type: "restaurant",
        subtypes: ["Authentic Dum Biryani", "Mughlai Dining"],
        rating: 4.7,
        reviewCount: 4200,
        priceLevel: 2,
        priceRange: "₹600 - ₹1,200 for two",
        address: "SD Road, Sappu Bagh Apartment, Jogani, Ramgopalpet, Secunderabad 500003",
        description: "The iconic Hyderabad dining institution founded in 1953, famous across the world for authentic layered dum biryani, mirchi ka salan, and double ka meetha.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.food[0],
          CITY_LANDMARK_REGISTRY.hyderabad.food[1]
        ],
        facilities: ["Air Conditioned", "Family Section", "Takeaway Counter", "Pure Desi Ghee Preparation"],
        coordinates: { lat: 17.4416, lng: 78.4983 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-hyd-8",
        name: "Roastery Coffee House",
        type: "cafe",
        subtypes: ["Artisanal Cafe", "Heritage Bungalow"],
        rating: 4.6,
        reviewCount: 1980,
        priceLevel: 2,
        priceRange: "₹400 - ₹800 for two",
        address: "House 418, 8-2-287/12, Road 14, Banjara Hills, Hyderabad 500034",
        description: "Charming bungalow cafe nestled in lush green trees of Banjara Hills, serving freshly roasted Indian estate coffees, cold brews, and continental snacks.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["roastery coffee house"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["roastery coffee house"][1]
        ],
        facilities: ["Outdoor Garden Seating", "Specialty Coffee Bar", "High-Speed WiFi", "Pet Friendly"],
        coordinates: { lat: 17.4168, lng: 78.4385 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-hyd-9",
        name: "Golkonda Resorts & Spa",
        type: "resort",
        subtypes: ["Wellness Sanctuary", "Lakeside Resort"],
        rating: 4.6,
        reviewCount: 1450,
        priceLevel: 3,
        priceRange: "₹7,500 - ₹16,000 / night",
        address: "Sagar Mahal Complex, Near Osman Sagar Lake, Gandipet, Hyderabad 500075",
        description: "Tranquil green sanctuary on the banks of Osman Sagar lake, offering private villas, Ayurvedic wellness treatments, and lakeside dining.",
        photos: [
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["golkonda resorts"][0],
          CITY_LANDMARK_REGISTRY.hyderabad.landmarks["golkonda resorts"][1]
        ],
        facilities: ["Swimming Pool", "Mayan Spa", "Tennis Court", "Lakeside Pavilion", "Complimentary Breakfast"],
        coordinates: { lat: 17.3879, lng: 78.3182 },
        city: "Hyderabad",
        state: "Telangana",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  bangalore: {
    aliases: ["bangalore", "bengaluru", "garden city", "silicon valley of india"],
    city: {
      name: "Bangalore",
      state: "Karnataka",
      lat: 12.9716,
      lng: 77.5946,
      image: CITY_LANDMARK_REGISTRY.bangalore.hero,
      description: "The Garden City and technology capital of India, renowned for its Tudor-style palace, Vidhana Soudha, pleasant weather, and lush parks."
    },
    places: [
      {
        id: "p-blr-1",
        name: "Bangalore Palace",
        type: "attraction",
        subtypes: ["Royal Palace", "Tudor Architecture"],
        rating: 4.7,
        reviewCount: 2950,
        priceLevel: 2,
        priceRange: "₹250 entry fee",
        address: "Vasanth Nagar, Bengaluru, Karnataka 560052",
        description: "Majestic 19th-century royal palace built in Tudor architectural style by the Wadiyar dynasty, with fortified towers, stained glass, and wood carvings.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["bangalore palace"][0],
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["bangalore palace"][1]
        ],
        facilities: ["Audio Guide", "Royal Ballroom", "Courtyard Garden", "Historic Artifacts"],
        coordinates: { lat: 12.9988, lng: 77.5921 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-blr-2",
        name: "Vidhana Soudha",
        type: "attraction",
        subtypes: ["Neo-Dravidian Architecture", "Seat of Government"],
        rating: 4.8,
        reviewCount: 3120,
        priceLevel: 1,
        priceRange: "Public Monument View",
        address: "Sampangi Rama Nagar, Bengaluru, Karnataka 560001",
        description: "Colossal granite legislative building described as a poem in stone, illuminated with thousands of lights on Sunday evenings and national holidays.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["vidhana soudha"][0],
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["vidhana soudha"][1]
        ],
        facilities: ["Architectural Photography", "Evening Illumination", "Landscaped Lawns"],
        coordinates: { lat: 12.9797, lng: 77.5907 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-blr-3",
        name: "Cubbon Park & Bamboo Groves",
        type: "attraction",
        subtypes: ["Botanical Park", "Heritage Greenery"],
        rating: 4.7,
        reviewCount: 2840,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "Kasturba Rd, Behind High Court, Bengaluru, Karnataka 560001",
        description: "A 300-acre lush green historic park in the center of Bengaluru, home to over 6,000 trees, bamboo thickets, colonial statues, and walking boulevards.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["cubbon park"][0],
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["cubbon park"][1]
        ],
        facilities: ["Jogging Trails", "Bandstand", "Seshadri Iyer Memorial Library", "Toy Train"],
        coordinates: { lat: 12.9763, lng: 77.5929 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-blr-4",
        name: "The Leela Palace Bangalore",
        type: "hotel",
        subtypes: ["Palatial Luxury", "Royal Stays"],
        rating: 4.9,
        reviewCount: 2100,
        priceLevel: 4,
        priceRange: "₹24,000 - ₹55,000 / night",
        address: "23, HAL Old Airport Rd, HAL 2nd Stage, Kodihalli, Bengaluru 560008",
        description: "Grand palace hotel inspired by the architecture of Mysore Palace, featuring gilded domes, archways, manicured gardens, and Michelin-tier dining.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["the leela palace"][0],
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["the leela palace"][1]
        ],
        facilities: ["Ayurvedic Spa", "Heated Swimming Pool", "Butler Service", "Jamavar Fine Dining"],
        coordinates: { lat: 12.9606, lng: 77.6484 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-blr-5",
        name: "Vidyarthi Bhavan (Since 1943)",
        type: "restaurant",
        subtypes: ["Crispy Benne Masala Dosa", "Heritage Tiffin"],
        rating: 4.8,
        reviewCount: 4600,
        priceLevel: 1,
        priceRange: "₹180 - ₹350 for two",
        address: "32, Gandhi Bazaar Main Rd, DVG Road, Basavanagudi, Bengaluru 560004",
        description: "Legendary South Indian tiffin room serving thick, golden-brown crispy Benne Masala Dosa with fresh coconut chutney and piping hot filter coffee for over 80 years.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.food[0],
          CITY_LANDMARK_REGISTRY.bangalore.food[1]
        ],
        facilities: ["Pure Vegetarian", "Heritage Ambiance", "Quick Table Turnaround", "Filter Coffee"],
        coordinates: { lat: 12.9439, lng: 77.5701 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-blr-6",
        name: "Sri Radha Krishna ISKCON Temple",
        type: "temple",
        subtypes: ["Spiritual Shrine", "Gopuram Architecture"],
        rating: 4.8,
        reviewCount: 3890,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "Hare Krishna Hill, Chord Rd, Rajajinagar, Bengaluru, Karnataka 560010",
        description: "Magnificent temple complex atop Hare Krishna Hill combining traditional Dravidian craftsmanship with modern glass canopies and daily kirtan rituals.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["iskcon temple"][0],
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["iskcon temple"][1]
        ],
        facilities: ["Prasadam Hall", "Vedic Cultural Exhibits", "Meditation Hall", "Shoe Counter"],
        coordinates: { lat: 13.0098, lng: 77.5511 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-blr-7",
        name: "Visvesvaraya Industrial & Technological Museum",
        type: "attraction",
        subtypes: ["Science Center", "Interactive Exhibits"],
        rating: 4.6,
        reviewCount: 1950,
        priceLevel: 1,
        priceRange: "₹85 entry fee",
        address: "Kasturba Rd, Near Cubbon Park, Bengaluru, Karnataka 560001",
        description: "Interactive science museum named after Bharat Ratna Sir M. Visvesvaraya, with hands-on engine displays, dinosaur enclave, and space exploration galleries.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["visvesvaraya industrial museum"][0],
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["visvesvaraya industrial museum"][1]
        ],
        facilities: ["Hands-on Experiments", "Planetarium Shows", "3D Theater", "Kid-Friendly"],
        coordinates: { lat: 12.9752, lng: 77.5963 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-blr-8",
        name: "Toit Brewpub Indiranagar",
        type: "cafe",
        subtypes: ["Microbrewery & Kitchen", "Gourmet Dining"],
        rating: 4.7,
        reviewCount: 3750,
        priceLevel: 2,
        priceRange: "₹1,200 - ₹2,000 for two",
        address: "298, 100 Feet Rd, Near BDA Complex, Indiranagar, Bengaluru 560038",
        description: "The pioneering Bangalore craft brewery renowned for its colonial pub atmosphere, house-brewed ales, wood-fired sourdough pizzas, and lively urban buzz.",
        photos: [
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["toit brewpub"][0],
          CITY_LANDMARK_REGISTRY.bangalore.landmarks["the black pearl"][0]
        ],
        facilities: ["Craft Beer Flights", "Wood-Fired Oven", "Valet Parking", "AC Seating"],
        coordinates: { lat: 12.9793, lng: 77.6406 },
        city: "Bangalore",
        state: "Karnataka",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  mumbai: {
    aliases: ["mumbai", "bombay", "city of dreams", "maximum city"],
    city: {
      name: "Mumbai",
      state: "Maharashtra",
      lat: 19.0760,
      lng: 72.8777,
      image: CITY_LANDMARK_REGISTRY.mumbai.hero,
      description: "The City of Dreams, home to the iconic Gateway of India, scenic Marine Drive, Bollywood glamour, and vibrant street delicacies."
    },
    places: [
      {
        id: "p-mum-1",
        name: "Gateway of India",
        type: "attraction",
        subtypes: ["Colonial Monument", "Harbor Promenade"],
        rating: 4.8,
        reviewCount: 4500,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
        description: "Iconic 26-meter basalt arch built in Indo-Saracenic style overlooking the Arabian Sea, watching ferry boats glide to Elephanta Island.",
        photos: [
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["gateway of india"][0],
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["gateway of india"][1]
        ],
        facilities: ["Harbor Promenade", "Ferry Boat Access", "Photography Point", "Heritage Walk"],
        coordinates: { lat: 18.9220, lng: 72.8347 },
        city: "Mumbai",
        state: "Maharashtra",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-mum-2",
        name: "Marine Drive (Queen's Necklace)",
        type: "attraction",
        subtypes: ["Coastal Promenade", "Sunset Point"],
        rating: 4.8,
        reviewCount: 4100,
        priceLevel: 1,
        priceRange: "Free Public Promenade",
        address: "Netaji Subhash Chandra Bose Road, Mumbai, Maharashtra 400020",
        description: "A 3.6-kilometer C-shaped curved coastal boulevard along the Arabian Sea, glittering like a string of pearls under streetlights at night.",
        photos: [
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["marine drive"][0],
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["marine drive"][1]
        ],
        facilities: ["Sunset Seawall Seating", "Art Deco Architecture", "Chai Stalls", "Breeze Promenade"],
        coordinates: { lat: 18.9432, lng: 72.8231 },
        city: "Mumbai",
        state: "Maharashtra",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-mum-3",
        name: "The Taj Mahal Palace Mumbai",
        type: "hotel",
        subtypes: ["Heritage Luxury", "Harbor Front"],
        rating: 4.9,
        reviewCount: 3800,
        priceLevel: 4,
        priceRange: "₹30,000 - ₹75,000 / night",
        address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001",
        description: "The grandest luxury landmark hotel in India, opened in 1903 opposite the Gateway of India, welcoming royalty, world leaders, and discerning travelers.",
        photos: [
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["the taj mahal palace"][0],
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["the taj mahal palace"][1]
        ],
        facilities: ["Harbor View Suites", "Sea Lounge Afternoon Tea", "Jiva Spa", "Outdoor Pool"],
        coordinates: { lat: 18.9217, lng: 72.8332 },
        city: "Mumbai",
        state: "Maharashtra",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-mum-4",
        name: "Shree Siddhivinayak Ganapati Temple",
        type: "temple",
        subtypes: ["Sacred Shrine", "Ganesh Mandir"],
        rating: 4.9,
        reviewCount: 5200,
        priceLevel: 1,
        priceRange: "Free Darshan",
        address: "SK Bole Marg, Prabhadevi, Mumbai, Maharashtra 400028",
        description: "One of the most revered Ganesh temples in India, featuring a two-century-old black stone idol of Lord Ganesha with a gold-plated inner sanctum.",
        photos: [
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["siddhivinayak temple"][0],
          CITY_LANDMARK_REGISTRY.mumbai.culture[0]
        ],
        facilities: ["Modak Prasadam", "VIP Darshan Counter", "Security Lockers", "Sacred Sanctum"],
        coordinates: { lat: 19.0169, lng: 72.8304 },
        city: "Mumbai",
        state: "Maharashtra",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-mum-5",
        name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
        type: "attraction",
        subtypes: ["Heritage Museum", "Indo-Saracenic Art"],
        rating: 4.7,
        reviewCount: 2600,
        priceLevel: 1,
        priceRange: "₹150 entry fee",
        address: "159-161, Mahatma Gandhi Road, Kala Ghoda, Fort, Mumbai 400023",
        description: "Formerly the Prince of Wales Museum, surrounded by lush palm gardens in Kala Ghoda, exhibiting ancient Indus Valley artifacts, miniature paintings, and armory.",
        photos: [
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["chhatrapati shivaji maharaj vastu sangrahalaya"][0],
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["gateway of india"][1]
        ],
        facilities: ["Audio Tour", "Japanese Art Pavilion", "Gift Shop", "Sculpture Courtyard"],
        coordinates: { lat: 18.9269, lng: 72.8327 },
        city: "Mumbai",
        state: "Maharashtra",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-mum-6",
        name: "Bandra-Worli Sea Link",
        type: "attraction",
        subtypes: ["Cable-Stayed Bridge", "Modern Engineering"],
        rating: 4.8,
        reviewCount: 3100,
        priceLevel: 1,
        priceRange: "Toll Road Drive",
        address: "Worli to Bandra, Mumbai, Maharashtra 400050",
        description: "An engineering marvel of steel cables and soaring towers spanning 5.6 kilometers across the open waters of Mahim Bay.",
        photos: [
          CITY_LANDMARK_REGISTRY.mumbai.landmarks["bandra worli sea link"][0],
          CITY_LANDMARK_REGISTRY.mumbai.culture[1]
        ],
        facilities: ["Coastal Drive", "Sunset Skyline Views", "Bandra Fort Viewing Point"],
        coordinates: { lat: 19.0330, lng: 72.8174 },
        city: "Mumbai",
        state: "Maharashtra",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-mum-7",
        name: "Juhu Beach & Chowpatty Street Flavors",
        type: "restaurant",
        subtypes: ["Mumbai Street Food", "Beachfront Stalls"],
        rating: 4.6,
        reviewCount: 3900,
        priceLevel: 1,
        priceRange: "₹150 - ₹400 for two",
        address: "Juhu Tara Rd, Juhu Beach, Mumbai, Maharashtra 400049",
        description: "The lively open beachfront known for freshly grilled butter pav bhaji, spicy bhelpuri, pani puri, and iced kulfi falooda under the evening sea breeze.",
        photos: [
          CITY_LANDMARK_REGISTRY.mumbai.food[0],
          CITY_LANDMARK_REGISTRY.mumbai.food[1]
        ],
        facilities: ["Sea Shore Seating", "Live Pav Bhaji Griddles", "Sunset Views", "Coconut Water"],
        coordinates: { lat: 19.0988, lng: 72.8264 },
        city: "Mumbai",
        state: "Maharashtra",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  delhi: {
    aliases: ["delhi", "new delhi", "dilli", "ncr"],
    city: {
      name: "Delhi",
      state: "Delhi",
      lat: 28.6139,
      lng: 77.2090,
      image: CITY_LANDMARK_REGISTRY.delhi.hero,
      description: "India's historic capital territory, where thousand-year-old Mughal monuments blend seamlessly with grand tree-lined avenues and vibrant food bazaars."
    },
    places: [
      {
        id: "p-del-1",
        name: "India Gate",
        type: "attraction",
        subtypes: ["War Memorial", "Kartavya Path"],
        rating: 4.8,
        reviewCount: 4900,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "Kartavya Path, India Gate, New Delhi, Delhi 110001",
        description: "A 42-meter triumphal stone archway honoring fallen soldiers, surrounded by fountains, green lawns, and the Amar Jawan Jyoti memorial flame.",
        photos: [
          CITY_LANDMARK_REGISTRY.delhi.landmarks["india gate"][0],
          CITY_LANDMARK_REGISTRY.delhi.landmarks["india gate"][0]
        ],
        facilities: ["Kartavya Path Promenade", "Evening Lighting", "Boating Canals", "Street Food Lawn"],
        coordinates: { lat: 28.6129, lng: 77.2295 },
        city: "Delhi",
        state: "Delhi",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-del-2",
        name: "Qutub Minar",
        type: "attraction",
        subtypes: ["UNESCO Heritage", "Victory Tower"],
        rating: 4.8,
        reviewCount: 3800,
        priceLevel: 1,
        priceRange: "₹40 entry fee",
        address: "Seth Sarai, Mehrauli, New Delhi, Delhi 110030",
        description: "A 72.5-meter red sandstone minaret carved with intricate Quranic inscriptions and lotus borders, accompanied by the 4th-century rust-resistant Iron Pillar.",
        photos: [
          CITY_LANDMARK_REGISTRY.delhi.landmarks["qutub minar"][0],
          CITY_LANDMARK_REGISTRY.delhi.culture[1]
        ],
        facilities: ["Ancient Iron Pillar", "Quwwat-ul-Islam Mosque", "Landscaped Gardens", "Audio Tour"],
        coordinates: { lat: 28.5244, lng: 77.1855 },
        city: "Delhi",
        state: "Delhi",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-del-3",
        name: "Red Fort (Lal Qila)",
        type: "attraction",
        subtypes: ["Mughal Fort", "UNESCO Heritage"],
        rating: 4.7,
        reviewCount: 4200,
        priceLevel: 1,
        priceRange: "₹50 entry fee",
        address: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006",
        description: "The primary residence of the Mughal emperors constructed by Shah Jahan in 1638, featuring the Diwan-i-Aam, marble pavilions, and the Meena Bazaar.",
        photos: [
          CITY_LANDMARK_REGISTRY.delhi.landmarks["red fort"][0],
          CITY_LANDMARK_REGISTRY.delhi.landmarks["red fort"][1]
        ],
        facilities: ["Museum Galleries", "Lahori Gate", "Sound & Light Show", "Mughal Gardens"],
        coordinates: { lat: 28.6562, lng: 77.2410 },
        city: "Delhi",
        state: "Delhi",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-del-4",
        name: "Lotus Temple (Bahá'í House of Worship)",
        type: "temple",
        subtypes: ["Modern Architectural Shrine", "Silent Prayer"],
        rating: 4.7,
        reviewCount: 3600,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "Lotus Temple Rd, Bahapur, Kalkaji, New Delhi, Delhi 110019",
        description: "Striking marble lotus flower with 27 free-standing petals opening into a tranquil prayer hall where visitors of all faiths pray in serene silence.",
        photos: [
          CITY_LANDMARK_REGISTRY.delhi.landmarks["lotus temple"][0],
          CITY_LANDMARK_REGISTRY.delhi.landmarks["humayun's tomb"][0]
        ],
        facilities: ["Peaceful Silent Hall", "9 Surrounding Ponds", "Information Center", "Wheelchair Access"],
        coordinates: { lat: 28.5535, lng: 77.2588 },
        city: "Delhi",
        state: "Delhi",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-del-5",
        name: "The Oberoi New Delhi",
        type: "hotel",
        subtypes: ["Contemporary Luxury", "Golf Course View"],
        rating: 4.9,
        reviewCount: 2200,
        priceLevel: 4,
        priceRange: "₹22,000 - ₹50,000 / night",
        address: "Dr Zakir Hussain Marg, Delhi Golf Club, Golf Links, New Delhi 110003",
        description: "Iconic luxury hotel overlooking the Delhi Golf Club and Humayun's Tomb, featuring clean air technology, rooftop cocktail lounge, and fine dining.",
        photos: [
          CITY_LANDMARK_REGISTRY.delhi.landmarks["the oberoi new delhi"][0],
          CITY_LANDMARK_REGISTRY.delhi.stays[0]
        ],
        facilities: ["Indoor & Outdoor Pools", "Oberoi Spa", "Rooftop Cirrus9 Bar", "Butler Service"],
        coordinates: { lat: 28.5986, lng: 77.2372 },
        city: "Delhi",
        state: "Delhi",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-del-6",
        name: "Karim's Historic Mughal Cuisine",
        type: "restaurant",
        subtypes: ["Old Delhi Mughlai", "Historic Eatery"],
        rating: 4.7,
        reviewCount: 4800,
        priceLevel: 2,
        priceRange: "₹600 - ₹1,200 for two",
        address: "16, Gali Kababian, Jama Masjid, Old Delhi, Delhi 110006",
        description: "Established in 1913 by royal chefs of the Mughal court, renowned for slow-cooked mutton nihari, seekh kebabs, butter chicken, and tandoori rotis.",
        photos: [
          CITY_LANDMARK_REGISTRY.delhi.food[0],
          CITY_LANDMARK_REGISTRY.delhi.landmarks["red fort"][0]
        ],
        facilities: ["Heritage Old Delhi Alley", "Air Conditioned Dining", "Tandoor Kitchen", "Nihari Specialty"],
        coordinates: { lat: 28.6508, lng: 77.2334 },
        city: "Delhi",
        state: "Delhi",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  chennai: {
    aliases: ["chennai", "madras"],
    city: {
      name: "Chennai",
      state: "Tamil Nadu",
      lat: 13.0827,
      lng: 80.2707,
      image: CITY_LANDMARK_REGISTRY.chennai.hero,
      description: "The Cultural Capital of South India, renowned for the world's second-longest urban beach (Marina Beach), Dravidian Gopuram temples, and Madras filter coffee."
    },
    places: [
      {
        id: "p-chn-1",
        name: "Marina Beach",
        type: "attraction",
        subtypes: ["Urban Beach Promenade", "Coastal Landmark", "Beaches"],
        rating: 4.6,
        reviewCount: 4200,
        priceLevel: 1,
        priceRange: "Free Public Access",
        address: "Kamarajar Salai, Marina Beach, Triplicane, Chennai, Tamil Nadu 600005",
        description: "Stretching 13 kilometers along the Bay of Bengal, the second-longest natural urban beach in the world with lighthouse views, horse rides, and evening sea breezes.",
        photos: [
          CITY_LANDMARK_REGISTRY.chennai.landmarks["marina beach"][0],
          CITY_LANDMARK_REGISTRY.chennai.landmarks["marina beach"][1]
        ],
        facilities: ["Lighthouse Observation Deck", "Sunrise Promenade", "Street Food Stalls", "Statues Walkway"],
        coordinates: { lat: 13.0500, lng: 80.2824 },
        city: "Chennai",
        state: "Tamil Nadu",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-chn-2",
        name: "Kapaleeshwarar Temple Mylapore",
        type: "temple",
        subtypes: ["Dravidian Architecture", "Shiva Temple", "Heritage"],
        rating: 4.8,
        reviewCount: 3890,
        priceLevel: 1,
        priceRange: "Free Darshan",
        address: "12, Vadakku Mada Veethi, Mylapore, Chennai, Tamil Nadu 600004",
        description: "7th-century Dravidian masterpiece dedicated to Lord Shiva, renowned for its colorful 37-meter Gopuram gate tower adorned with detailed mythological stucco figures and a sacred tank.",
        photos: [
          CITY_LANDMARK_REGISTRY.chennai.landmarks["kapaleeshwarar temple"][0],
          CITY_LANDMARK_REGISTRY.chennai.landmarks["kapaleeshwarar temple"][1]
        ],
        facilities: ["Historic Gopuram", "Temple Water Tank", "Prasadam Counter", "Pooja Ceremonies"],
        coordinates: { lat: 13.0334, lng: 80.2685 },
        city: "Chennai",
        state: "Tamil Nadu",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-chn-3",
        name: "San Thome Cathedral Basilica",
        type: "attraction",
        subtypes: ["Neo-Gothic Basilica", "Historical Pilgrimage", "Heritage"],
        rating: 4.7,
        reviewCount: 2600,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "38, Santhome High Rd, Dumming Kuppam, Mylapore, Chennai, Tamil Nadu 600004",
        description: "Built in the 16th century by Portuguese explorers over the tomb of St. Thomas the Apostle, this gleaming white Neo-Gothic cathedral features stained-glass windows and a museum.",
        photos: [
          CITY_LANDMARK_REGISTRY.chennai.landmarks["san thome basilica"][0],
          CITY_LANDMARK_REGISTRY.chennai.landmarks["fort st george"][0]
        ],
        facilities: ["Apostle Tomb Crypt", "Heritage Museum", "Stained Glass Nave", "Sea Breeze Courtyard"],
        coordinates: { lat: 13.0336, lng: 80.2780 },
        city: "Chennai",
        state: "Tamil Nadu",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-chn-4",
        name: "ITC Grand Chola Luxury Hotel",
        type: "hotel",
        subtypes: ["Chola Palace Architecture", "Ultra Luxury", "Stays"],
        rating: 4.9,
        reviewCount: 3100,
        priceLevel: 4,
        priceRange: "₹18,000 - ₹45,000 / night",
        address: "63, Mount Road, Guindy, Chennai, Tamil Nadu 600032",
        description: "An architectural tribute to Southern India's historic Chola dynasty, featuring 600 carved marble pillars, 10 signature restaurants, and opulent palace hospitality.",
        photos: [
          CITY_LANDMARK_REGISTRY.chennai.landmarks["itc grand chola"][0],
          CITY_LANDMARK_REGISTRY.chennai.landmarks["taj coromandel"][0]
        ],
        facilities: ["Kaya Kalp Royal Spa", "3 Outdoor Swimming Pools", "Peshawri Fine Dining", "Helipad & Valet"],
        coordinates: { lat: 13.0104, lng: 80.2207 },
        city: "Chennai",
        state: "Tamil Nadu",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-chn-5",
        name: "Murugan Idli Shop & Madras Coffee",
        type: "restaurant",
        subtypes: ["Authentic Tamil Cuisine", "Breakfast & Filter Coffee", "Food"],
        rating: 4.7,
        reviewCount: 4500,
        priceLevel: 1,
        priceRange: "₹250 - ₹500 for two",
        address: "46/1, GN Chetty Rd, Parthasarathi Puram, T. Nagar, Chennai, Tamil Nadu 600017",
        description: "World-famous legendary South Indian dining spot serving steaming soft mallipoo idlis, crispy ghee podi dosas, four distinct house chutneys, and piping hot frothy Madras filter coffee.",
        photos: [
          CITY_LANDMARK_REGISTRY.chennai.landmarks["murugan idli shop"][0],
          CITY_LANDMARK_REGISTRY.chennai.landmarks["filter coffee"][0]
        ],
        facilities: ["Traditional Banana Leaf Serving", "Ghee Podi Special", "Filter Coffee Counter", "Air Conditioned Dining"],
        coordinates: { lat: 13.0418, lng: 80.2341 },
        city: "Chennai",
        state: "Tamil Nadu",
        vegFriendly: true,
        nonVegFriendly: false
      },
      {
        id: "p-chn-6",
        name: "DakshinaChitra Heritage Living Museum",
        type: "attraction",
        subtypes: ["South Indian Heritage Villages", "Craft Center", "Culture"],
        rating: 4.6,
        reviewCount: 1980,
        priceLevel: 1,
        priceRange: "₹175 Entry Ticket",
        address: "East Coast Road, Muttukadu, Chennai, Tamil Nadu 603112",
        description: "A living history museum showcasing 18 authentic heritage houses from Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh, with folk art performances and artisan workshops.",
        photos: [
          CITY_LANDMARK_REGISTRY.chennai.landmarks["dakshinachitra"][0],
          CITY_LANDMARK_REGISTRY.chennai.landmarks["dakshinachitra"][1]
        ],
        facilities: ["Artisan Craft Demos", "Heritage Courtyards", "Puppet Shows", "Traditional Weaving"],
        coordinates: { lat: 12.8257, lng: 80.2435 },
        city: "Chennai",
        state: "Tamil Nadu",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  agra: {
    aliases: ["agra", "taj city"],
    city: {
      name: "Agra",
      state: "Uttar Pradesh",
      lat: 27.1767,
      lng: 78.0081,
      image: CITY_LANDMARK_REGISTRY.agra.hero,
      description: "Home of the iconic Taj Mahal, the pinnacle of Mughal architecture and one of the Seven Wonders of the World on the banks of the Yamuna River."
    },
    places: [
      {
        id: "p-agr-1",
        name: "Taj Mahal",
        type: "attraction",
        subtypes: ["Seven Wonders", "UNESCO Heritage", "Mughal Architecture"],
        rating: 4.9,
        reviewCount: 9800,
        priceLevel: 1,
        priceRange: "₹50 entry fee",
        address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
        description: "An immense mausoleum of pure ivory-white marble commissioned in 1632 by Mughal emperor Shah Jahan, standing as the universal symbol of love.",
        photos: [
          CITY_LANDMARK_REGISTRY.agra.landmarks["taj mahal"][0],
          CITY_LANDMARK_REGISTRY.agra.landmarks["taj mahal"][0]
        ],
        facilities: ["Audio Guide", "Battery Bus Shuttle", "Shoe Covers", "Marble Reflection Pools"],
        coordinates: { lat: 27.1751, lng: 78.0421 },
        city: "Agra",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-agr-2",
        name: "Agra Fort",
        type: "attraction",
        subtypes: ["UNESCO Heritage", "Red Sandstone Fort"],
        rating: 4.8,
        reviewCount: 4600,
        priceLevel: 1,
        priceRange: "₹40 entry fee",
        address: "Agra Fort, Rakabganj, Agra, Uttar Pradesh 282003",
        description: "Massive 16th-century Mughal red sandstone citadel that served as the main residence of Mughal emperors Akbar, Jahangir, and Shah Jahan.",
        photos: [
          CITY_LANDMARK_REGISTRY.agra.landmarks["agra fort"][0],
          CITY_LANDMARK_REGISTRY.agra.culture[0]
        ],
        facilities: ["Diwan-i-Khas", "Jahangir Palace", "Khas Mahal", "Yamuna River Views"],
        coordinates: { lat: 27.1795, lng: 78.0211 },
        city: "Agra",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-agr-3",
        name: "Fatehpur Sikri Imperial Complex",
        type: "attraction",
        subtypes: ["Ghost City", "Mughal Architecture"],
        rating: 4.7,
        reviewCount: 3100,
        priceLevel: 1,
        priceRange: "₹50 entry fee",
        address: "Fatehpur Sikri, Uttar Pradesh 283110",
        description: "A fortified historic red sandstone city founded by Emperor Akbar in 1569, home to the Buland Darwaza and the Tomb of Salim Chishti.",
        photos: [
          CITY_LANDMARK_REGISTRY.agra.landmarks["fatehpur sikri"][0],
          CITY_LANDMARK_REGISTRY.agra.landmarks["agra fort"][0]
        ],
        facilities: ["Buland Darwaza", "Panch Mahal", "Jama Masjid", "Archaeological Museum"],
        coordinates: { lat: 27.0945, lng: 77.6679 },
        city: "Agra",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-agr-4",
        name: "ITC Mughal Luxury Resort & Spa",
        type: "hotel",
        subtypes: ["Mughal Heritage Hotel", "Luxury Stay"],
        rating: 4.8,
        reviewCount: 2400,
        priceLevel: 4,
        priceRange: "₹14,000 - ₹35,000 / night",
        address: "Fatehabad Road, Tajganj, Agra, Uttar Pradesh 282001",
        description: "Set amidst 23 acres of lush Mughal gardens, this luxury hotel pays tribute to the grandeur of the Mughal era with Kaya Kalp spa and fine dining.",
        photos: [
          CITY_LANDMARK_REGISTRY.agra.stays[0],
          CITY_LANDMARK_REGISTRY.agra.hero
        ],
        facilities: ["Kaya Kalp Spa", "Swimming Pools", "Peshawri Dining", "Lush Mughal Gardens"],
        coordinates: { lat: 27.1610, lng: 78.0410 },
        city: "Agra",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-agr-5",
        name: "Pinch of Spice & Agra Petha Delights",
        type: "restaurant",
        subtypes: ["Mughlai Cuisine", "North Indian Fine Dining"],
        rating: 4.6,
        reviewCount: 3800,
        priceLevel: 2,
        priceRange: "₹800 - ₹1,500 for two",
        address: "1076/2, Fatehabad Road, Tajganj, Agra, Uttar Pradesh 282001",
        description: "Celebrated dining destination serving rich Mughlai gravies, murgh boti masala, tandoori rotis, and traditional Agra petha desserts.",
        photos: [
          CITY_LANDMARK_REGISTRY.agra.food[0],
          CITY_LANDMARK_REGISTRY.agra.food[0]
        ],
        facilities: ["Air Conditioned", "Valet Parking", "Family Dining", "Petha Sweet Counter"],
        coordinates: { lat: 27.1590, lng: 78.0450 },
        city: "Agra",
        state: "Uttar Pradesh",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

  jaipur: {
    aliases: ["jaipur", "pink city"],
    city: {
      name: "Jaipur",
      state: "Rajasthan",
      lat: 26.9124,
      lng: 75.7873,
      image: CITY_LANDMARK_REGISTRY.jaipur.hero,
      description: "The vibrant Pink City of Rajasthan, famed for majestic hilltop forts, the honeycomb facade of Hawa Mahal, and royal Rajput heritage."
    },
    places: [
      {
        id: "p-jpr-1",
        name: "Hawa Mahal (Palace of Winds)",
        type: "attraction",
        subtypes: ["Pink Sandstone", "Rajput Architecture"],
        rating: 4.8,
        reviewCount: 5200,
        priceLevel: 1,
        priceRange: "₹50 entry fee",
        address: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
        description: "Five-story palace facade with 953 intricately carved jharokha windows built in 1799 for royal women to observe street life without being seen.",
        photos: [
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["hawa mahal"][0],
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["hawa mahal"][1]
        ],
        facilities: ["Historic Jharokhas", "Wind Breeze Corridors", "Museum Gallery", "Rooftop Views"],
        coordinates: { lat: 26.9239, lng: 75.8267 },
        city: "Jaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-jpr-2",
        name: "Amer Fort (Amber Palace)",
        type: "attraction",
        subtypes: ["Hilltop Fortress", "UNESCO Heritage"],
        rating: 4.9,
        reviewCount: 6800,
        priceLevel: 1,
        priceRange: "₹100 entry fee",
        address: "Devisinghpura, Amer, Jaipur, Rajasthan 302028",
        description: "A monumental 16th-century fortress situated high on Cheel ka Teela hill, famous for the glittering Sheesh Mahal mirror palace and Maota Lake.",
        photos: [
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["amer fort"][0],
          CITY_LANDMARK_REGISTRY.jaipur.culture[0]
        ],
        facilities: ["Sheesh Mahal", "Elephant Ride Pathway", "Diwan-i-Khas", "Light & Sound Show"],
        coordinates: { lat: 26.9855, lng: 75.8513 },
        city: "Jaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-jpr-3",
        name: "City Palace Jaipur",
        type: "attraction",
        subtypes: ["Royal Residence", "Museum Complex"],
        rating: 4.7,
        reviewCount: 3900,
        priceLevel: 2,
        priceRange: "₹200 entry fee",
        address: "Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
        description: "A sprawling palace complex blending Mughal and Rajput architecture, featuring the Chandra Mahal, Mubarak Mahal, and ornate peacock courtyards.",
        photos: [
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["city palace"][0],
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["hawa mahal"][0]
        ],
        facilities: ["Peacock Gate", "Royal Armory Museum", "Silver Urns Display", "Chandra Mahal"],
        coordinates: { lat: 26.9258, lng: 75.8237 },
        city: "Jaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-jpr-4",
        name: "Jal Mahal (Water Palace)",
        type: "attraction",
        subtypes: ["Lake Palace", "Scenic Viewpoint"],
        rating: 4.6,
        reviewCount: 3100,
        priceLevel: 1,
        priceRange: "Free Shoreline Viewing",
        address: "Amer Rd, Jal Mahal, Amer, Jaipur, Rajasthan 302002",
        description: "A picturesque five-story palace appearing to float serenely in the middle of Man Sagar Lake, surrounded by the dramatic Aravalli hills.",
        photos: [
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["jal mahal"][0],
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["amer fort"][0]
        ],
        facilities: ["Promenade Walk", "Sunset Photography", "Camel Rides", "Craft Stalls"],
        coordinates: { lat: 26.9535, lng: 75.8462 },
        city: "Jaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-jpr-5",
        name: "The Raj Palace Heritage Grand Hotel",
        type: "hotel",
        subtypes: ["Royal Heritage Palace", "Luxury Stay"],
        rating: 4.8,
        reviewCount: 1600,
        priceLevel: 4,
        priceRange: "₹20,000 - ₹55,000 / night",
        address: "Zorawer Singh Gate, Amer Road, Chokdi Gangapol, Jaipur, Rajasthan 302002",
        description: "An authentic 18th-century royal palace converted into a world-class luxury hotel, adorned with antique chandeliers, crystal fountains, and museum suites.",
        photos: [
          CITY_LANDMARK_REGISTRY.jaipur.landmarks["the raj palace hotel"][0],
          CITY_LANDMARK_REGISTRY.jaipur.stays[0]
        ],
        facilities: ["Swimming Pool", "Spa & Wellness", "Swapna Mahal Dining", "Royal Museum Tour"],
        coordinates: { lat: 26.9388, lng: 75.8340 },
        city: "Jaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-jpr-6",
        name: "Laxmi Mishthan Bhandar (LMB) & Dal Baati",
        type: "restaurant",
        subtypes: ["Rajasthani Thali", "Heritage Eatery"],
        rating: 4.7,
        reviewCount: 4400,
        priceLevel: 2,
        priceRange: "₹600 - ₹1,200 for two",
        address: "98-99, Johari Bazar, Bapu Bazar, Pink City, Jaipur, Rajasthan 302003",
        description: "Iconic sweet shop and dining spot operating since 1727, revered for authentic Dal Baati Churma, crisp pyaaz kachoris, and Ghewar sweets.",
        photos: [
          CITY_LANDMARK_REGISTRY.jaipur.food[0],
          CITY_LANDMARK_REGISTRY.jaipur.food[0]
        ],
        facilities: ["Pure Desi Ghee", "Rajasthani Royal Thali", "Air Conditioned", "Ghewar Counter"],
        coordinates: { lat: 26.9205, lng: 75.8277 },
        city: "Jaipur",
        state: "Rajasthan",
        vegFriendly: true,
        nonVegFriendly: false
      }
    ]
  },

  goa: {
    aliases: ["goa", "panaji", "north goa", "south goa"],
    city: {
      name: "Goa",
      state: "Goa",
      lat: 15.2993,
      lng: 74.1240,
      image: CITY_LANDMARK_REGISTRY.goa.hero,
      description: "India's coastal paradise of palm-fringed golden beaches, 17th-century Portuguese cathedrals, vibrant beach shacks, and delicious seafood."
    },
    places: [
      {
        id: "p-goa-1",
        name: "Fort Aguada",
        type: "attraction",
        subtypes: ["17th Century Portuguese Fort", "Lighthouse"],
        rating: 4.7,
        reviewCount: 4100,
        priceLevel: 1,
        priceRange: "₹50 entry fee",
        address: "Aguada Fort Rd, Candolim, Goa 403515",
        description: "Well-preserved 17th-century Portuguese fortress and historic 4-tier lighthouse overlooking the convergence of the Mandovi River and Arabian Sea.",
        photos: [
          CITY_LANDMARK_REGISTRY.goa.landmarks["fort aguada"][0],
          CITY_LANDMARK_REGISTRY.goa.culture[0]
        ],
        facilities: ["Ancient Lighthouse", "Sea View Ramparts", "Freshwater Spring", "Sunset Lookout"],
        coordinates: { lat: 15.4920, lng: 73.7737 },
        city: "Goa",
        state: "Goa",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-goa-2",
        name: "Basilica of Bom Jesus",
        type: "temple",
        subtypes: ["UNESCO Heritage", "Baroque Architecture"],
        rating: 4.8,
        reviewCount: 3900,
        priceLevel: 1,
        priceRange: "Free Admission",
        address: "Old Goa Rd, Bainguinim, Goa 403402",
        description: "16th-century UNESCO World Heritage church housing the sacred mortal remains of St. Francis Xavier, considered the finest example of Baroque architecture in India.",
        photos: [
          CITY_LANDMARK_REGISTRY.goa.landmarks["basilica of bom jesus"][0],
          CITY_LANDMARK_REGISTRY.goa.landmarks["fort aguada"][0]
        ],
        facilities: ["Sacred Relics Crypt", "Art Gallery", "Historic Bell Tower", "Carved Altar"],
        coordinates: { lat: 15.5009, lng: 73.9116 },
        city: "Goa",
        state: "Goa",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-goa-3",
        name: "Calangute Beach Promenade",
        type: "attraction",
        subtypes: ["Queen of Beaches", "Watersports"],
        rating: 4.6,
        reviewCount: 5600,
        priceLevel: 1,
        priceRange: "Free Beach Access",
        address: "Calangute, North Goa, Goa 403516",
        description: "Known as the Queen of Beaches, offering a lively golden sand coastline packed with parasailing, jet skis, sunbeds, and beach shacks.",
        photos: [
          CITY_LANDMARK_REGISTRY.goa.landmarks["calangute beach"][0],
          CITY_LANDMARK_REGISTRY.goa.landmarks["baga beach"][0]
        ],
        facilities: ["Watersports Centers", "Sunbed Rentals", "Lifeguard Tower", "Beach Shacks"],
        coordinates: { lat: 15.5442, lng: 73.7553 },
        city: "Goa",
        state: "Goa",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-goa-4",
        name: "Taj Exotica Resort & Spa Goa",
        type: "hotel",
        subtypes: ["Mediterranean Resort", "Beachfront Luxury"],
        rating: 4.9,
        reviewCount: 2800,
        priceLevel: 4,
        priceRange: "₹24,000 - ₹60,000 / night",
        address: "Calwaddo, Benaulim, Salcete, Goa 403716",
        description: "Mediterranean-style resort sprawling across 56 acres of tropical greenery on the southwest coast of Goa, facing the pristine sands of Benaulim beach.",
        photos: [
          CITY_LANDMARK_REGISTRY.goa.landmarks["taj exotica resort & spa"][0],
          CITY_LANDMARK_REGISTRY.goa.stays[0]
        ],
        facilities: ["Private Beach Access", "Jiva Spa", "Outdoor Swimming Pools", "Golf Course"],
        coordinates: { lat: 15.2472, lng: 73.9212 },
        city: "Goa",
        state: "Goa",
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-goa-5",
        name: "Curlies Beach Shack & Seafood Grill",
        type: "restaurant",
        subtypes: ["Goan Seafood", "Beach Shack"],
        rating: 4.6,
        reviewCount: 4300,
        priceLevel: 2,
        priceRange: "₹700 - ₹1,500 for two",
        address: "South Anjuna Beach, Anjuna, Goa 403509",
        description: "Legendary beachfront shack established in the 1980s, offering chilled oceanfront dining with fresh catch kingfish rava fry, prawn balchao, and sunset views.",
        photos: [
          CITY_LANDMARK_REGISTRY.goa.landmarks["curlies beach shack"][0],
          CITY_LANDMARK_REGISTRY.goa.food[0]
        ],
        facilities: ["Oceanfront Seating", "Live Catch Seafood", "Sunset Deck", "Cocktail Bar"],
        coordinates: { lat: 15.5732, lng: 73.7432 },
        city: "Goa",
        state: "Goa",
        vegFriendly: true,
        nonVegFriendly: true
      }
    ]
  },

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

};