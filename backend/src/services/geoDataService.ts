import { Place, PlaceType, CityInfo } from "../models/types";

export interface QueryMetadata {
  cityName: string;
  suggestedTab?: "all" | "tourism" | "stays" | "food" | "temples" | string;
}

export const OFFLINE_GEO_DB: Record<string, { lat: number; lng: number; state: string; name: string }> = {
  "tirupati": { lat: 13.6288, lng: 79.4192, state: "Andhra Pradesh", name: "Tirupati" },
  "tirupathi": { lat: 13.6288, lng: 79.4192, state: "Andhra Pradesh", name: "Tirupati" },
  "tirumala": { lat: 13.6773, lng: 79.3496, state: "Andhra Pradesh", name: "Tirumala" },
  "amritsar": { lat: 31.6340, lng: 74.8723, state: "Punjab", name: "Amritsar" },
  "varanasi": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh", name: "Varanasi" },
  "banaras": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh", name: "Varanasi" },
  "kashi": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh", name: "Varanasi" },
  "kochi": { lat: 9.9312, lng: 76.2673, state: "Kerala", name: "Kochi" },
  "cochin": { lat: 9.9312, lng: 76.2673, state: "Kerala", name: "Kochi" },
  "vizag": { lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh", name: "Visakhapatnam" },
  "visakhapatnam": { lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh", name: "Visakhapatnam" },
  "madurai": { lat: 9.9252, lng: 78.1198, state: "Tamil Nadu", name: "Madurai" },
  "puri": { lat: 19.8135, lng: 85.8312, state: "Odisha", name: "Puri" },
  "haridwar": { lat: 29.9457, lng: 78.1642, state: "Uttarakhand", name: "Haridwar" },
  "rishikesh": { lat: 30.0869, lng: 78.2676, state: "Uttarakhand", name: "Rishikesh" },
  "ooty": { lat: 11.4102, lng: 76.6950, state: "Tamil Nadu", name: "Ooty" },
  "munnar": { lat: 10.0889, lng: 77.0595, state: "Kerala", name: "Munnar" },
  "hyderabad": { lat: 17.3850, lng: 78.4867, state: "Telangana", name: "Hyderabad" },
  "bangalore": { lat: 12.9716, lng: 77.5946, state: "Karnataka", name: "Bangalore" },
  "bengaluru": { lat: 12.9716, lng: 77.5946, state: "Karnataka", name: "Bangalore" },
  "goa": { lat: 15.2993, lng: 74.1240, state: "Goa", name: "Goa" },
  "delhi": { lat: 28.7041, lng: 77.1025, state: "Delhi", name: "Delhi" },
  "mumbai": { lat: 19.0760, lng: 72.8777, state: "Maharashtra", name: "Mumbai" },
  "jaipur": { lat: 26.9124, lng: 75.7873, state: "Rajasthan", name: "Jaipur" },
  "chennai": { lat: 13.0827, lng: 80.2707, state: "Tamil Nadu", name: "Chennai" },
  "kolkata": { lat: 22.5726, lng: 88.3639, state: "West Bengal", name: "Kolkata" },
  "pune": { lat: 18.5204, lng: 73.8567, state: "Maharashtra", name: "Pune" },
  "ahmedabad": { lat: 23.0225, lng: 72.5714, state: "Gujarat", name: "Ahmedabad" },
  "agra": { lat: 27.1767, lng: 78.0081, state: "Uttar Pradesh", name: "Agra" },
  "hampi": { lat: 15.3350, lng: 76.4600, state: "Karnataka", name: "Hampi" },
  "udaipur": { lat: 24.5854, lng: 73.7125, state: "Rajasthan", name: "Udaipur" },
  "srinagar": { lat: 34.0837, lng: 74.7973, state: "Jammu and Kashmir", name: "Srinagar" },
  "pondicherry": { lat: 11.9416, lng: 79.8083, state: "Puducherry", name: "Pondicherry" }
};

// Helper function to fetch with a strict timeout to avoid hanging when API is blocked or slow
export async function fetchWithTimeout(url: string, options: any = {}, timeoutMs: number = 2000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const KNOWN_INDIAN_CITIES = [
  "hyderabad", "bangalore", "bengaluru", "goa", "delhi", "mumbai", "bombay", "jaipur", "varanasi", "banaras", "kashi",
  "tirupati", "tirupathi", "tirumala", "amritsar", "kochi", "cochin", "vizag", "visakhapatnam", "madurai", "puri",
  "haridwar", "rishikesh", "ooty", "munnar", "chennai", "madras", "kolkata", "calcutta", "pune", "poona", "ahmedabad",
  "surat", "agra", "hampi", "udaipur", "jodhpur", "kozhikode", "calicut", "trivandrum", "thiruvananthapuram", "mysore",
  "mysuru", "coorg", "kodagu", "shimla", "manali", "leh", "ladakh", "darjeeling", "pondicherry", "puducherry",
  "gangtok", "shillong", "dehradun", "nainital", "mussoorie", "dharamshala", "allahabad", "prayagraj", "lucknow",
  "patna", "bhopal", "indore", "kanpur", "nagpur", "coimbatore", "vijayawada", "guntur", "nellore", "kakinada",
  "rajahmundry", "anantapur", "kadapa", "cuddapah", "kurnool", "warangal", "secunderabad", "aurangabad", "nashik",
  "thane", "shirdi", "ranchi", "jamshedpur", "dhanbad", "bhubaneswar", "cuttack", "guwahati", "raipur", "bilaspur",
  "jabalpur", "gwalior", "ujjain", "ajmer", "pushkar", "jaisalmer", "bikaner", "alwar", "ranthambore", "srinagar",
  "jammu", "gulmarg", "pahalgam", "sonamarg", "katra", "vaishno devi"
];

export const LANDMARK_TO_CITY: Record<string, { city: string; tab?: string }> = {
  "golden temple": { city: "Amritsar", tab: "temples" },
  "harmandir sahib": { city: "Amritsar", tab: "temples" },
  "durgiana temple": { city: "Amritsar", tab: "temples" },
  "jallianwala bagh": { city: "Amritsar", tab: "tourism" },
  "wagah border": { city: "Amritsar", tab: "tourism" },
  
  "charminar": { city: "Hyderabad", tab: "tourism" },
  "golconda fort": { city: "Hyderabad", tab: "tourism" },
  "birla mandir": { city: "Hyderabad", tab: "temples" },
  "ramoji": { city: "Hyderabad", tab: "tourism" },
  
  "taj mahal": { city: "Agra", tab: "tourism" },
  "agra fort": { city: "Agra", tab: "tourism" },
  
  "ghat": { city: "Varanasi", tab: "tourism" },
  "ganga aarti": { city: "Varanasi", tab: "tourism" },
  "kashi vishwanath": { city: "Varanasi", tab: "temples" },
  "sarnath": { city: "Varanasi", tab: "tourism" },
  
  "beach": { city: "Goa", tab: "tourism" },
  "calangute": { city: "Goa", tab: "tourism" },
  "baga": { city: "Goa", tab: "tourism" },
  "anjuna": { city: "Goa", tab: "tourism" },
  "colva": { city: "Goa", tab: "tourism" },
  "basilica": { city: "Goa", tab: "tourism" },
  
  "gateway of india": { city: "Mumbai", tab: "tourism" },
  "marine drive": { city: "Mumbai", tab: "tourism" },
  "elephanta caves": { city: "Mumbai", tab: "tourism" },
  
  "india gate": { city: "Delhi", tab: "tourism" },
  "qutub minar": { city: "Delhi", tab: "tourism" },
  "red fort": { city: "Delhi", tab: "tourism" },
  "lotus temple": { city: "Delhi", tab: "temples" },
  
  "biryani": { city: "Hyderabad", tab: "food" },
  "dosa": { city: "Bangalore", tab: "food" },
  
  "hawa mahal": { city: "Jaipur", tab: "tourism" },
  "amber fort": { city: "Jaipur", tab: "tourism" },
  "city palace": { city: "Jaipur", tab: "tourism" }
};

export function resolveQueryMetadata(query: string): QueryMetadata {
  const queryLower = query.toLowerCase().trim();

  // 1. Check for specific landmarks first
  const landmarkKeys = Object.keys(LANDMARK_TO_CITY);
  for (const landmark of landmarkKeys) {
    if (queryLower.includes(landmark)) {
      const mapping = LANDMARK_TO_CITY[landmark];
      return {
        cityName: mapping.city,
        suggestedTab: mapping.tab
      };
    }
  }

  // 2. Check for known cities in the query
  for (const city of KNOWN_INDIAN_CITIES) {
    if (queryLower.includes(city)) {
      let resolvedCity = city.charAt(0).toUpperCase() + city.slice(1);
      if (city === "bengaluru") resolvedCity = "Bangalore";
      else if (city === "bombay") resolvedCity = "Mumbai";
      else if (city === "madras") resolvedCity = "Chennai";
      else if (city === "calcutta") resolvedCity = "Kolkata";
      else if (city === "banaras" || city === "kashi") resolvedCity = "Varanasi";
      else if (city === "tirupathi" || city === "tirumala") resolvedCity = "Tirupati";
      else if (city === "cochin") resolvedCity = "Kochi";
      else if (city === "vizag") resolvedCity = "Visakhapatnam";
      else if (city === "puducherry") resolvedCity = "Pondicherry";
      else if (city === "mysuru") resolvedCity = "Mysore";
      else if (city === "kodagu") resolvedCity = "Coorg";
      else if (city === "cuddapah") resolvedCity = "Kadapa";
      else if (city === "prayagraj") resolvedCity = "Allahabad";

      // Try to detect category/tab from query
      let suggestedTab: string | undefined;
      if (queryLower.includes("hotel") || queryLower.includes("resort") || queryLower.includes("stay") || queryLower.includes("accommodation")) {
        suggestedTab = "stays";
      } else if (queryLower.includes("food") || queryLower.includes("restaurant") || queryLower.includes("cafe") || queryLower.includes("eat") || queryLower.includes("dine") || queryLower.includes("biryani")) {
        suggestedTab = "food";
      } else if (queryLower.includes("temple") || queryLower.includes("shrine") || queryLower.includes("mandir") || queryLower.includes("pilgrim")) {
        suggestedTab = "temples";
      } else if (queryLower.includes("museum") || queryLower.includes("attraction") || queryLower.includes("sight") || queryLower.includes("monument") || queryLower.includes("visit") || queryLower.includes("fort") || queryLower.includes("palace")) {
        suggestedTab = "tourism";
      }

      return {
        cityName: resolvedCity,
        suggestedTab
      };
    }
  }

  // 3. Fallback to noise words removal geocoding
  const parsedCity = extractCityName(query);
  return {
    cityName: parsedCity
  };
}

// Query parser to extract clean city name from travel-specific search terms
export function extractCityName(query: string): string {
  const queryLower = query.toLowerCase().trim();
  
  // Remove common prefix/suffix noise words
  let cleaned = queryLower
    .replace(/\bin\b/g, "")
    .replace(/\bhotels\b/g, "")
    .replace(/\bhotel\b/g, "")
    .replace(/\bresorts\b/g, "")
    .replace(/\bresort\b/g, "")
    .replace(/\brestaurants\b/g, "")
    .replace(/\brestaurant\b/g, "")
    .replace(/\bcafes\b/g, "")
    .replace(/\bcafe\b/g, "")
    .replace(/\btemples\b/g, "")
    .replace(/\btemple\b/g, "")
    .replace(/\bmuseums\b/g, "")
    .replace(/\bmuseum\b/g, "")
    .replace(/\bplaces\b/g, "")
    .replace(/\bplace\b/g, "")
    .replace(/\bthings to do\b/g, "")
    .replace(/\bto visit\b/g, "")
    .replace(/\bvisit\b/g, "")
    .replace(/\bbest\b/g, "")
    .replace(/\bnear\b/g, "")
    .replace(/\bfor\b/g, "")
    .trim();
    
  // Clean double spaces
  cleaned = cleaned.replace(/\s+/g, " ");
  
// Capitalize first letter of each word
  return cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || query;
}

const photosDbMaster = {
  hotel: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
    "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600"
  ],
  resort: [
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600",
    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600",
    "https://images.unsplash.com/photo-1605153322277-dd0d7f608b4d?w=600"
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600",
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600"
  ],
  cafe: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=600",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600"
  ],
  attraction: [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    "https://images.unsplash.com/photo-1558431382-27e303142255?w=600", // Victoria Memorial Museum
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600",
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
    "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600", // Jaipur Hawa Mahal
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
    "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600"
  ],
  temple: [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", // Varanasi temple
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600"
  ],
  lake: [
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"
  ]
};

export function getSanitizedPhotos(type: string, name: string, cityName: string, i: number, customPool?: any): string[] {
  let photos: string[] = [];
  const nameLower = name.toLowerCase();
  const cityLower = cityName.toLowerCase();
  const cityHash = cityName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (nameLower.includes("golden temple") || cityLower.includes("amritsar")) {
    photos = [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"
    ];
  } else if (nameLower.includes("charminar") || cityLower.includes("hyderabad")) {
    photos = [
      "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (nameLower.includes("taj mahal") || nameLower.includes("taj")) {
    photos = [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"
    ];
  } else if (cityLower.includes("varanasi") || nameLower.includes("ghat") || nameLower.includes("ganga")) {
    photos = [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600"
    ];
  } else if (cityLower.includes("goa") || nameLower.includes("beach")) {
    photos = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
    ];
  } else if (cityLower.includes("bangalore") && (nameLower.includes("palace") || nameLower.includes("attraction"))) {
    photos = [
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (cityLower.includes("mumbai") && nameLower.includes("gateway")) {
    photos = [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (cityLower.includes("delhi") && nameLower.includes("gate")) {
    photos = [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (cityLower.includes("kerala") || nameLower.includes("houseboat") || nameLower.includes("backwaters")) {
    photos = [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600",
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600"
    ];
  } else if (nameLower.includes("street food") || nameLower.includes("dhaba")) {
    photos = [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600"
    ];
  } else if (nameLower.includes("biryani") || nameLower.includes("pulao") || nameLower.includes("rice")) {
    photos = [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600"
    ];
  } else if (nameLower.includes("dosa") || nameLower.includes("idli") || nameLower.includes("south indian") || nameLower.includes("sambar")) {
    photos = [
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
    ];
  } else if (nameLower.includes("samosa") || nameLower.includes("chaat") || nameLower.includes("sweet") || nameLower.includes("dessert")) {
    photos = [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
    ];
  } else if (nameLower.includes("curry") || nameLower.includes("paneer") || nameLower.includes("masala") || nameLower.includes("punjabi")) {
    photos = [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
    ];
  }

  if (photos.length === 0) {
    let resolvedType = type || "attraction";
    if (resolvedType === "attraction" && (nameLower.includes("temple") || nameLower.includes("shrine") || nameLower.includes("mandir"))) {
      resolvedType = "temple";
    } else if (resolvedType === "attraction" && (
      nameLower.includes("lake") || nameLower.includes("cheruvu") || nameLower.includes("reservoir") || 
      nameLower.includes("canal") || nameLower.includes("river") || nameLower.includes("boat")
    )) {
      resolvedType = "lake";
    }
    const pool = (customPool && customPool[resolvedType]) || (photosDbMaster as any)[resolvedType] || photosDbMaster.attraction;
    const firstIdx = (cityHash + i * 4) % pool.length;
    const secondIdx = (cityHash + i * 4 + 1) % pool.length;
    const thirdIdx = (cityHash + i * 4 + 2) % pool.length;
    const fourthIdx = (cityHash + i * 4 + 3) % pool.length;
    photos = [
      pool[firstIdx],
      pool[secondIdx] || pool[firstIdx],
      pool[thirdIdx] || pool[firstIdx],
      pool[fourthIdx] || pool[secondIdx]
    ];
  }
  return photos;
}

// Curated City Specific Images
const CURATED_CITY_IMAGES: Record<string, string> = {
  "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
  "hyderabad": "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800",
  "bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
  "bengaluru": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
  "delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  "new delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  "mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
  "jaipur": "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800",
  "varanasi": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "banaras": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "kashi": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "amritsar": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
  "agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
  "udaipur": "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=800",
  "srinagar": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
  "hampi": "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
  "kochi": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
  "cochin": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
  "munnar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
  "ooty": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "pondicherry": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
  "puducherry": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
  "rishikesh": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800",
  "haridwar": "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
  "kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
  "calcutta": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
  "chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "madras": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "tirupati": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "tirupathi": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "tirumala": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "vizag": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "visakhapatnam": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "madurai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "puri": "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=800",
  "darjeeling": "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
  "gangtok": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
  "shillong": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
  "mysore": "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800",
  "coorg": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "lonavala": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "mahabaleshwar": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "pune": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800",
  "ahmedabad": "https://images.unsplash.com/photo-1603258593453-14d4291a1a45?w=800",
  "port blair": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
};

// General pool for all other cities (50 images)
const generalCityPool = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
  "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=800",
  "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
  "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
  "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
  "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
  "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800",
  "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800",
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
  "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
  "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
  "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=800",
  "https://images.unsplash.com/photo-1603258593453-14d4291a1a45?w=800",
  "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
  "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800",
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
  "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
];

export function getCityImage(cityName: string): string {
  const nameLower = cityName.toLowerCase().trim();
  if ((CURATED_CITY_IMAGES as any)[nameLower]) {
    return (CURATED_CITY_IMAGES as any)[nameLower];
  }
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % generalCityPool.length;
  return generalCityPool[idx];
}

export function getCityDescription(cityName: string, stateName: string): string {
  const nameLower = cityName.toLowerCase().trim();
  const stateLower = stateName.toLowerCase().trim();
  let theme = 'rivers_delta';

  if (
    stateLower === "goa" || stateLower === "andaman & nicobar" || stateLower === "lakshadweep" ||
    nameLower.endsWith("patnam") || nameLower.endsWith("patanam") || nameLower.endsWith("coast") ||
    nameLower.endsWith("beach") || nameLower.endsWith("port") ||
    ["visakhapatnam", "kakinada", "machilipatnam", "bapatla", "mumbai", "puducherry", "chennai", "kochi", "alappuzha", "mangalore", "thoothukudi", "karwar", "daman", "diu"].includes(nameLower)
  ) {
    theme = 'beaches';
  } else if (
    nameLower.includes("valley") || nameLower.includes("hills") || nameLower.includes("giri") ||
    nameLower.includes("mandi") || nameLower.includes("solan") || nameLower.includes("shimla") ||
    nameLower.includes("manali") || nameLower.includes("kullu") || nameLower.includes("dharamshala") ||
    nameLower.includes("ooty") || nameLower.includes("darjeeling") || nameLower.includes("mussoorie") ||
    nameLower.includes("munnar") || nameLower.includes("lonavala") || nameLower.includes("hill") ||
    nameLower.includes("sohra") || nameLower.includes("cherrapunji") || nameLower.includes("paderu") ||
    nameLower.includes("lachen") || nameLower.includes("lachung") || nameLower.includes("tawang") ||
    nameLower.includes("ziro") || nameLower.includes("leh")
  ) {
    theme = 'scenic_hills';
  } else if (
    nameLower.endsWith("giri") || nameLower.endsWith("temple") || nameLower.endsWith("mandir") ||
    nameLower.includes("tirupati") || nameLower.includes("srikalahasti") || nameLower.includes("srisailam") ||
    nameLower.includes("varanasi") || nameLower.includes("puri") || nameLower.includes("gaya") ||
    nameLower.includes("ayodhya") || nameLower.includes("madurai") || nameLower.includes("kanchipuram") ||
    nameLower.includes("vellore") || nameLower.includes("thanjavur") || nameLower.includes("ujjain") ||
    nameLower.includes("pushkar") || nameLower.includes("rameswaram") || nameLower.includes("dwaraka") ||
    nameLower.includes("kedarnath") || nameLower.includes("badrinath") || nameLower.includes("haridwar") ||
    nameLower.includes("rishikesh") || nameLower.includes("amritsar") || nameLower.includes("somnath") ||
    nameLower.includes("shirdi") || nameLower.includes("kalyan") || nameLower.includes("golgonda")
  ) {
    theme = 'temples';
  } else if (
    nameLower.includes("fort") || nameLower.includes("palace") || nameLower.includes("jaipur") ||
    nameLower.includes("jodhpur") || nameLower.includes("udaipur") || nameLower.includes("bikaner") ||
    nameLower.includes("jaisalmer") || nameLower.includes("kota") || nameLower.includes("gwalior") ||
    nameLower.includes("agra") || nameLower.includes("jhansi") || nameLower.includes("delhi") ||
    nameLower.includes("reddy") || nameLower.includes("mahal") || nameLower.includes("nizam")
  ) {
    theme = 'historic_forts';
  } else if (
    ["bangalore", "hyderabad", "gurgaon", "noida", "chandigarh", "pune", "ahmedabad", "navi mumbai", "secunderabad"].includes(nameLower)
  ) {
    theme = 'modern_urban';
  }

  const descriptions: Record<string, string> = {
    beaches: `Explore the beautiful coastal city of ${cityName} in ${stateName}. Famous for its pristine sandy beaches, refreshing sea breezes, local seafood delicacies, and vibrant coastal culture.`,
    scenic_hills: `Discover the breathtaking hill destination of ${cityName} in ${stateName}. Celebrated for its misty valleys, panoramic viewpoints, pleasant weather, and lush green natural landscape.`,
    temples: `Visit the sacred spiritual heritage center of ${cityName} in ${stateName}. Renowned for its magnificent ancient temples, rich mythological history, and peaceful cultural atmosphere.`,
    historic_forts: `Step back in time in the historic city of ${cityName} in ${stateName}. Known for its grand royal forts, majestic palaces, legacy monuments, and stories of ancient heritage.`,
    modern_urban: `Experience the dynamic urban vibes of ${cityName} in ${stateName}. A major modern hub featuring spectacular skylines, bustling streets, diverse culinary avenues, and tech innovations.`,
    rivers_delta: `Immerse yourself in the scenic beauty of ${cityName} in ${stateName}. Located in a lush riverfront region, celebrated for its fertile green fields, quiet waterways, and local agrarian heritage.`
  };

  return descriptions[theme] || descriptions.rivers_delta;
}

const CITY_LANDMARKS: Record<string, {
  temples?: { name: string; desc: string; photo: string }[];
  lakes?: { name: string; desc: string; photo: string }[];
  attractions?: { name: string; desc: string; photo: string }[];
}> = {
  dharmavaram: {
    temples: [
      { name: "Sri Lakshmi Chennakesava Swamy Temple", desc: "A magnificent 14th-century Vijayanagara empire temple famous for its musical stone pillars, exquisite sculptures, and towering Rajagopuram.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" },
      { name: "Sri Ramalingeswara Swamy Temple", desc: "A serene and ancient temple dedicated to Lord Shiva, featuring historic carvings and a peaceful courtyard for meditation.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" }
    ],
    lakes: [
      { name: "Dharmavaram Cheruvu (Lake)", desc: "One of the oldest and largest irrigation lakes in the region, built by the Vijayanagara kings. Offers beautiful sunset views and a scenic lake bund walkway.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Dharmavaram Handloom Silk Weaving Center", desc: "Visit the traditional weavers preparing the world-famous Dharmavaram silk sarees. Watch the intricate gold brocade work and silk yarn spinning.", photo: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600" },
      { name: "Kothakonda Hill Fort Ruins", desc: "A historical hilltop fort situated on the outskirts, featuring ancient rock-cut steps, gate ruins, and panoramic valley views.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  tirupati: {
    temples: [
      { name: "Sri Venkateswara Swamy Temple (Tirumala)", desc: "The world-famous hilltop temple dedicated to Lord Venkateswara (Balaji). A glorious spiritual hub with a gold-plated dome and daily sacred rituals.", photo: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600" },
      { name: "Sri Padmavathi Ammavari Temple (Tiruchanur)", desc: "An ancient temple dedicated to Goddess Padmavathi, the consort of Lord Venkateswara, featuring beautiful temple gardens and pond.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" },
      { name: "Sri Kapileswara Swamy Temple", desc: "A sacred temple dedicated to Lord Shiva, nestled at the foot of Tirumala Hills right next to a beautiful natural waterfall.", photo: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600" }
    ],
    lakes: [
      { name: "Swami Pushkarini Holy Tank", desc: "The sacred temple tank situated adjacent to the main Tirumala temple, believed to possess purifying properties.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Silathoranam Natural Arch", desc: "A rare geological wonder located on Tirumala hills—a natural stone arch structure formed over 1.5 billion years ago.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Srivari Museum", desc: "A museum showcasing the rich history of the Tirumala temple, ancient weapons, stone sculptures, and historical photos.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  vijayawada: {
    temples: [
      { name: "Kanaka Durga Temple", desc: "The famous temple of Goddess Durga situated atop the Indrakeeladri Hill on the banks of the Krishna River, offering stunning city views.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" },
      { name: "Undavalli Caves (Cave Temples)", desc: "Monolithic 7th-century rock-cut cave temples featuring a colossal statue of Lord Vishnu in a reclining posture.", photo: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600" }
    ],
    lakes: [
      { name: "Bhavani River Island & Boating", desc: "A large river island on the Krishna River offering boating, water sports, peaceful nature trails, and sunset viewpoints.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Prakasam Barrage & Lake", desc: "An iconic bridge and regulator spanning 1.2 km across the Krishna River, creating a vast lake backdrop illuminated beautifully at night.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Gandhi Hill Viewpoint", desc: "The first Gandhi memorial in India on a hill, featuring a 52-foot tall stupa, toy train rides, and a planetarium.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  visakhapatnam: {
    temples: [
      { name: "Simhachalam Temple", desc: "An ancient 11th-century hilltop temple dedicated to Lord Narasimha, featuring exquisite stone carvings and beautiful stepwell gardens.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Mudasarlova Lake & Park", desc: "A scenic freshwater lake nestled in a valley, surrounded by hills, featuring golf courses, picnic parks, and water birds.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Rishikonda Beach & Watersports", desc: "A golden-sand beach famous for windsurfing, boating, and scenic sunset cliffs.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
      { name: "INS Kursura Submarine Museum", desc: "A real Russian-built submarine decommissioned and preserved on the beach as a museum, showing maritime crew life.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" },
      { name: "Kailasagiri Hilltop Park", desc: "A scenic hill park overlooking the Bay of Bengal, featuring colossal white statues of Shiva and Parvathi, and a cable car.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  vizag: {
    temples: [
      { name: "Simhachalam Temple", desc: "An ancient 11th-century hilltop temple dedicated to Lord Narasimha, featuring exquisite stone carvings and beautiful stepwell gardens.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Mudasarlova Lake & Park", desc: "A scenic freshwater lake nestled in a valley, surrounded by hills, featuring golf courses, picnic parks, and water birds.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Rishikonda Beach & Watersports", desc: "A golden-sand beach famous for windsurfing, boating, and scenic sunset cliffs.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
      { name: "INS Kursura Submarine Museum", desc: "A real Russian-built submarine decommissioned and preserved on the beach as a museum, showing maritime crew life.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" },
      { name: "Kailasagiri Hilltop Park", desc: "A scenic hill park overlooking the Bay of Bengal, featuring colossal white statues of Shiva and Parvathi, and a cable car.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  araku: {
    temples: [
      { name: "Matsyagundam Shiva Temple", desc: "A unique spiritual stream in a rocky valley where thousands of sacred fish swim, protected by the local deity temple.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" }
    ],
    lakes: [
      { name: "Araku Lake Reserve", desc: "A peaceful reservoir pond surrounded by forest hills and coffee plantations.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Borra Caves", desc: "Spectacular million-year-old limestone caves featuring stalactite and stalagmite formations lit with colorful lights.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Araku Tribal Museum", desc: "A museum showcasing the lifestyle, handicrafts, bows, and mud-house replicas of Eastern Ghats tribes.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" },
      { name: "Katiki Waterfalls", desc: "A stunning 50-foot waterfall cascading through green jungles, accessible via a short scenic trek.", photo: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600" }
    ]
  },
  srisailam: {
    temples: [
      { name: "Mallikarjuna Jyotirlinga Temple", desc: "One of the 12 sacred Shiva Jyotirlingas in India. A massive fort-like temple complex with historical rock carvings.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" },
      { name: "Bhramaramba Devi Shakti Peetham", desc: "One of the 18 main Shakti Peethas in India, situated within the Mallikarjuna temple complex, dedicated to Goddess Parvathi.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Srisailam Dam Reservoir", desc: "A massive water reservoir nestled in the Nallamala forest valleys, offering boating and magnificent gate opening views.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Pathala Ganga Ropeway", desc: "A scenic cable car ropeway descending down a steep cliff to the sacred Krishna riverbed for holy baths and boating.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  rajahmundry: {
    temples: [
      { name: "Iskcon Temple Rajahmundry", desc: "A beautiful riverside temple complex featuring colorful deity shrines, gardens, and spiritual bhajan halls.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Godavari River Ghats & Boating", desc: "The grand riverbanks of Godavari, featuring scenic evening aarti rituals, boating ghats, and beautiful sunset viewpoints.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Godavari Arch Bridge", desc: "An engineering marvel—a 2.7 km long arch bridge spanning the majestic Godavari River, offering panoramic rail views.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Papi Hills (Papikondalu) Cruise", desc: "A scenic boat cruise starting from Rajahmundry passing through the narrow gorges and majestic forest hills of Godavari.", photo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600" }
    ]
  },
  nellore: {
    temples: [
      { name: "Sri Ranganathaswamy Temple (Talpagiri)", desc: "A magnificent 12th-century temple dedicated to Lord Vishnu, situated on the bank of the Penna River, featuring a grand 96-foot Rajagopuram.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" }
    ],
    lakes: [
      { name: "Pulicat Lake Flamingo Lagoon", desc: "The second-largest brackish water lagoon in India, famous for hosting thousands of migratory pink flamingos.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" },
      { name: "Nellore Tank (Nellore Cheruvu)", desc: "A vast historical lake featuring a scenic concrete bund walkway, parks, and speed boating activities.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Mypadu Beach Coastline", desc: "A serene and clean sandy beach on the Bay of Bengal, featuring APTDC beach resorts and water cruise boats.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ]
  },
  eluru: {
    temples: [
      { name: "Dwaraka Tirumala Temple", desc: "A famous hilltop temple of Lord Venkateswara, built in the style of Tirumala, located a short drive from Eluru.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Kolleru Lake Bird Sanctuary", desc: "India's largest freshwater lake and bird sanctuary. A spectacular wetland ecosystem hosting pelicans, storks, and ducks.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Eluru Buddha Park Lake", desc: "A beautiful municipal park featuring a colossal, majestic 74-foot tall standing Buddha statue in the middle of a lake.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  lepakshi: {
    temples: [
      { name: "Veerabhadra Temple (Lepakshi)", desc: "A world-renowned treasure of Vijayanagara architecture, famous for its hanging pillar, the giant footprint of Goddess Sita, and beautiful ceiling frescoes.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    attractions: [
      { name: "Monolithic Basavanna (Lepakshi Nandi)", desc: "A spectacular 15-foot high, 27-foot long monolithic granite bull, carved from a single stone, showcasing master craftsmanship.", photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600" },
      { name: "Lepakshi Archaeological Park", desc: "A walk through the historic outer walls, mandapams, and rock inscriptions surrounding the temple compound.", photo: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600" }
    ]
  },
  guntur: {
    temples: [
      { name: "Sri Amaralingeswara Swamy Temple (Amaravathi)", desc: "Ancient temple of Lord Shiva situated on the banks of Krishna River, featuring a colossal 15-foot white Shiva Lingam.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "NTR Manasa Sarovar Park Lake", desc: "A beautiful urban park lake featuring boating, landscaped gardens, and musical fountains.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Kondaveedu Fort Ruins", desc: "A historic 14th-century hill fortress with massive stone ramparts, gateways, temple ruins, and panoramic valley views.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Amaravathi Archaeological Museum", desc: "Showcases exquisite Buddhist sculptures, relics, and limestone carvings dating back to the 3rd century BCE.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  kurnool: {
    temples: [
      { name: "Yaganti Uma Maheswara Temple", desc: "Famous cave temple of Lord Shiva where the stone Nandi statue is believed to be continuously growing in size.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Konda Reddy Buruju Water Tank", desc: "Historic water tank next to the iconic 12th-century Konda Reddy Buruju bastion.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Konda Reddy Buruju", desc: "An iconic monolithic stone bastion built by the Vijayanagara kings in the heart of Kurnool city.", photo: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600" },
      { name: "Belum Caves", desc: "The longest and second-largest cave system in the Indian subcontinent, featuring natural stalactite formations.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  kadapa: {
    temples: [
      { name: "Devuni Kadapa Sri Lakshmi Venkateswara Temple", desc: "Historic temple known as the threshold to Tirumala Venkateswara Temple, built by the Vijayanagara kings.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Bugga Vanka Riverfront Walk", desc: "A serene walking track along the banks of the local Bugga Vanka stream.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Gandikota Grand Canyon & Fort", desc: "Often called the Grand Canyon of India, featuring spectacular gorge cliffs along the Pennar River and ruins of Gandikota Fort.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ]
  },
  kakinada: {
    temples: [
      { name: "Sri Kumara Rama Bheemeshwara Swamy Temple", desc: "One of the Pancharama Kshetras dedicated to Lord Shiva, featuring a towering two-story sanctum.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Kakinada Salt Creek & Boat Club", desc: "A scenic tidal waterway offering boat cruises, speed boats, and views of harbor docks.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Coringa Mangroves Boardwalk", desc: "The second largest stretch of mangrove forests in India, featuring scenic wooden canopy walkways and boating routes.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" },
      { name: "Hope Island Scenic Spit", desc: "A natural sand spit barrier protecting the Kakinada harbor, offering scenic views of ship hulls.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ]
  },
  anantapur: {
    temples: [
      { name: "Sri Kadiri Laxmi Narasimha Swamy Temple", desc: "A famous ancient temple where the deity is self-manifested (Swayambhu), drawing pilgrims from all over.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Ananthasagar Cheruvu (Lake)", desc: "The historic city lake built by the Vijayanagara kings, offering quiet waters and sunset viewpoints.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Monolithic ISKCON Temple Chariot", desc: "A modern architectural marvel designed in the shape of a horse-drawn chariot.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  puttaparthi: {
    temples: [
      { name: "Prasanthi Nilayam (Main Ashram)", desc: "The world-famous spiritual ashram of Sri Sathya Sai Baba, featuring grand prayer halls, meditation spaces, and gardens.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Sri Sathya Sai Samadhi Lake Reserve", desc: "A calm reservoir lake situated next to the holy samadhi shrine.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Chaitanya Jyoti Museum", desc: "An architectural wonder displaying the life and teachings of Sri Sathya Sai Baba.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  }
};

export function generateMockPlaces(cityName: string, stateName: string, lat: number, lng: number, originalQuery: string = ""): Place[] {
  const list: Place[] = [];
  const cityLower = cityName.toLowerCase();
  const stateLower = stateName.toLowerCase();
  const cityHash = cityName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  function shuffleArray<T>(arr: T[], seed: number): T[] {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.abs(seed + i) % (i + 1);
      const temp = newArr[i];
      newArr[i] = newArr[j];
      newArr[j] = temp;
    }
    return newArr;
  }

  // 1. Detect city theme
  let theme: "coastal" | "mountain" | "heritage" | "south_india" | "metro" = "metro";
  if (
    cityLower.includes("goa") || cityLower.includes("vizag") || cityLower.includes("beach") ||
    cityLower.includes("pondicherry") || cityLower.includes("kochi") || cityLower.includes("kerala") ||
    cityLower.includes("mumbai") || cityLower.includes("chennai") || cityLower.includes("puri") ||
    cityLower.includes("port") || cityLower.includes("visakhapatnam")
  ) {
    theme = "coastal";
  } else if (
    stateLower === "himachal pradesh" || stateLower === "uttarakhand" || 
    stateLower === "jammu & kashmir" || stateLower === "ladakh" || stateLower === "sikkim" ||
    cityLower.includes("ooty") || cityLower.includes("munnar") || cityLower.includes("coorg") ||
    cityLower.includes("kodaikanal") || cityLower.includes("manali") || cityLower.includes("shimla") ||
    cityLower.includes("himalaya") || cityLower.includes("valley") || cityLower.includes("hill") ||
    cityLower.includes("darjeeling") || cityLower.includes("gangtok") || cityLower.includes("leh") ||
    cityLower.includes("wayanad") || cityLower.includes("mussoorie") || cityLower.includes("nainital")
  ) {
    theme = "mountain";
  } else if (
    stateLower === "rajasthan" || stateLower === "gujarat" ||
    cityLower.includes("temple") || cityLower.includes("shiva") || cityLower.includes("varanasi") ||
    cityLower.includes("madurai") || cityLower.includes("rishikesh") || cityLower.includes("haridwar") ||
    cityLower.includes("ujjain") || cityLower.includes("ayodhya") || cityLower.includes("shirdi") ||
    cityLower.includes("amritsar") || cityLower.includes("agra") || cityLower.includes("hampi") ||
    cityLower.includes("heritage") || cityLower.includes("jaipur") || cityLower.includes("udaipur") ||
    cityLower.includes("jodhpur") || cityLower.includes("fort") || cityLower.includes("palace")
  ) {
    theme = "heritage";
  } else if (
    stateLower === "andhra pradesh" || stateLower === "telangana" || 
    stateLower === "tamil nadu" || stateLower === "karnataka" || stateLower === "kerala"
  ) {
    theme = "south_india";
  }

  // 2. Define theme-specific name lists
  const rawNames = {
    coastal: {
      hotel: ["Sea Breeze Residency", "Ocean Vista Stays", "Marine Bay Hotel", "Coconut Grove Inn", "Oceanic Shore Motel", "Coastal Highway Motel"],
      resort: ["Blue Lagoon Beach Resort", "Coral Reef Spa & Resort", "Oceanic Retreat & Spa"],
      restaurant: ["The Crab Shack", "Riverside Seafood Grill", "Coastal Spices Dinette"],
      cafe: ["The Sand Deck Cafe", "Wave Catchers Cafe", "Tidal Coffee Bar"],
      attraction: ["Pristine Sandy Beach", "Historic Coastal Fort & Lighthouse", "Scenic Sunset Cliff Lookout", "Maritime Heritage Museum"],
      temple: ["Ancient Coastal Shore Temple", "Mahalasa Narayani Shrine", "Somnath Seaside Temple", "Maritime Shiva Temple"]
    },
    mountain: {
      hotel: ["Mist Valley Residency", "Pine Wood Stays", "Cliff Edge Inn", "Highland Meadows Hotel", "Alpine Pass Motel", "Valley Crest Motel"],
      resort: ["Whispering Pines Forest Resort", "Mountain Crest Eco Resort", "Snowy Peaks Valley Retreat"],
      restaurant: ["The Alpine Kitchen", "Warm Clay Tandoor", "Valley View Diner"],
      cafe: ["The Mountain Brew Cafe", "Mist & Mug Coffee Shop", "The Cozy Hearth Cafe"],
      attraction: ["Snowy Peak Viewpoint", "Lush Tea Plantation Walk", "Sparkling Forest Waterfall", "Tribal Culture Museum"],
      temple: ["Hidimba Devi Forest Temple", "Jakhoo Hanuman Hill Temple", "Manu ancient Valley Temple", "Nainital Naina Devi Temple"]
    },
    heritage: {
      hotel: ["Royal Heritage Palace", "Haveli Gateway Stays", "Golden Temple Residency", "Imperial Fort Hotel", "Highway Haveli Motel", "Heritage Gateway Motel"],
      resort: ["Traditional Ethnic Village Resort", "Heritage Palace Retreat & Spa", "The Sanctuary Resort"],
      restaurant: ["Darbar Royal Dining", "Shanti Bhavan Veg Palace", "The Curry Pot Heritage"],
      cafe: ["The Chai Chauk Cafe", "Aesthetic Temple Cafe", "The Culture Cup"],
      attraction: ["City Palace Museum Tour", "Historic Fort & Museum Ruins", "Royal Cenotaphs", "Archaeological Excavation Site"],
      temple: ["Akshardham Temple Complex", "Brihadeeswarar Heritage Temple", "Sun Temple Konark", "Meenakshi Amman Temple"]
    },
    south_india: {
      hotel: ["Siri Deluxe Inn", "Sri Balaji Residency", "Venkata Sai Guest House", "Dwaraka Plaza Stays", "Highway Grand Motel", "Deccan Highway Inn"],
      resort: ["Haritha Valley Resorts", "Gouthami Riverfront Retreat", "Satya Hills Eco Resort"],
      restaurant: ["Sri Lakshmi Pure Veg", "Kanakadurga Family Restaurant", "Godavari Ruchulu", "Annapurna Tiffins"],
      cafe: ["Filter Kaapi Club", "Raju Gari Coffee Shop", "Deccan Brews Cafe"],
      attraction: ["Local Weaver Cooperative Street", "Scenic Lake Bund Walkway", "Historic Clock Tower Plaza"],
      temple: ["Sri Kasi Visweswara Swamy Temple", "Ganesh Chowk Shrine", "Sri Venkateswara Swamy Temple"]
    },
    metro: {
      hotel: ["Grand Regency", "Royal Orchid Hotel", "The Fern Residency", "Citrus City Inn", "Grand Highway Motel", "Transit Motel & Suites"],
      resort: ["Jungle Retreat & Spa", "Green Meadows Resort", "The Oasis Club & Resort"],
      restaurant: ["The Curry Pot", "Swad Junction", "Nawaab's Kitchen", "Spice Route"],
      cafe: ["The Roasted Bean", "Brews & Bytes", "The Hideout Cafe", "Urban Cup"],
      attraction: ["Botanical Gardens Walk", "City Center Museum", "Sunset Point Lookout", "National Science Center Museum"],
      temple: ["Historic Birla Mandir", "Lotus Temple Shrine", "ISKCON Spiritual Temple", "Chattarpur Heritage Temple"]
    }
  }[theme];

  let names = {
    hotel: shuffleArray(rawNames.hotel, cityHash),
    resort: shuffleArray(rawNames.resort, cityHash + 1),
    restaurant: shuffleArray(rawNames.restaurant, cityHash + 2),
    cafe: shuffleArray(rawNames.cafe, cityHash + 3),
    attraction: shuffleArray(rawNames.attraction, cityHash + 4),
    temple: shuffleArray(rawNames.temple, cityHash + 5)
  };

  // Custom overrides for specific pilgrim and tourist towns
  if (cityLower.includes("tirupati") || cityLower.includes("tirupathi") || cityLower.includes("tirumala")) {
    names = {
      hotel: ["Taj Tirupati", "Marasa Sarovar Premiere", "Fortune Select Grand Ridge", "Bhimas Deluxe Hotel"],
      resort: ["Srivari Tirumala Valley Resort", "Hill View Wellness Retreat", "The Pilgrims Sanctuary Resort"],
      restaurant: ["Bhimas Paradise Veg Dining", "Sri Lakshmi Narayana Pure Veg", "Woodlands Heritage Veg"],
      cafe: ["The Coffee Pot Tirupati", "Srivari Heritage Cafe", "Filter Kaapi Club"],
      attraction: ["Kapila Theertham Sacred Waterfall", "Srivari Museum & Photo Gallery", "Silathoranam Natural Arch"],
      temple: [
        "Sri Venkateswara Swamy Temple (Tirumala)",
        "Sri Padmavathi Ammavari Temple",
        "Sri Govindaraja Swamy Temple",
        "Sri Kapileswara Swamy Temple"
      ]
    };
  } else if (cityLower.includes("amritsar")) {
    names = {
      hotel: ["Taj Swarna Amritsar", "Hyatt Regency Amritsar", "Radisson Blu Amritsar", "Welcomhotel Amritsar"],
      resort: ["Ranjit's Svaasa Heritage Boutique Resort", "Amritsar Farmhouse Resort", "The Golden Retreat"],
      restaurant: ["Kesar Da Dhaba", "Bharawan Da Dhaba", "Surjit Food Plaza"],
      cafe: ["The Giani Tea Stall", "Elgin Cafe Amritsar", "The Bean Street"],
      attraction: ["Jallianwala Bagh Memorial", "Wagah Border Ceremony", "Partition Museum"],
      temple: [
        "The Golden Temple (Harmandir Sahib)",
        "Durgiana Temple",
        "Shivala Bhaian Temple",
        "Sri Ram Tirath Temple"
      ]
    };
  } else if (cityLower.includes("varanasi") || cityLower.includes("banaras") || cityLower.includes("kashi")) {
    names = {
      hotel: ["BrijRama Palace Heritage Hotel", "Taj Ganges Varanasi", "Radisson Hotel Varanasi", "Alka Guest House"],
      resort: ["Tree of Life Resort & Spa Varanasi", "Ganga Heritage Retreat", "The Varanasi Sanctuary"],
      restaurant: ["Kashi Chat Bhandar", "Deena Chat Bhandar", "Canton Royale Restaurant"],
      cafe: ["The Brown Bread Bakery", "Open Hand Cafe Varanasi", "Blue Lassi Shop"],
      attraction: ["Dashashwamedh Ghat Ganga Aarti", "Sarnath Buddhist Pilgrimage Ruins", "Ramnagar Fort & Museum"],
      temple: [
        "Kashi Vishwanath Temple (Golden Temple)",
        "Sankat Mochan Hanuman Temple",
        "New Vishwanath Temple (BHU)",
        "Durga Kund Temple"
      ]
    };
  }

  // 2.5. Query-specific overrides for offline mock places names
  if (originalQuery) {
    const qLower = originalQuery.toLowerCase();
    if (qLower.includes("biryani") || qLower.includes("pulao")) {
      names.restaurant = [
        "Paradise Biryani Hub",
        "Bawarchi Biryani House",
        "Shah Ghouse Hotel & Restaurant",
        "Cafe Bahar Biryani Palace"
      ];
    } else if (qLower.includes("dosa") || qLower.includes("idli") || qLower.includes("south indian")) {
      names.restaurant = [
        "Saravana Bhavan",
        "MTR Mavalli Tiffin Room",
        "Vidyarthi Bhavan Dosa",
        "Sri Lakshmi Pure Veg"
      ];
    }
  }

  // 3. Define theme-specific Unsplash photos
  const photosDb = {
    coastal: {
      hotel: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ]
    },
    mountain: {
      hotel: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600",
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=600" // Victoria Memorial Museum
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", // Varanasi temple
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ]
    },
    heritage: {
      hotel: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=600", // Victoria Memorial Museum
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", // Varanasi temple
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ]
    },
    south_india: {
      hotel: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600",
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600",
        "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600"
      ]
    },
    metro: {
      hotel: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=600", // Victoria Memorial Museum
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
        "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600", // Jaipur Hawa Mahal
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" // Varanasi temple
      ]
    }
  }[theme];

  const createMock = (
    id: string, 
    name: string, 
    type: PlaceType, 
    subtypes: string[], 
    description: string, 
    facilities: string[], 
    photos: string[], 
    minPrice: number, 
    maxPrice: number, 
    address: string
  ) => {
    const offsetLat = lat + (Math.random() - 0.5) * 0.02;
    const offsetLng = lng + (Math.random() - 0.5) * 0.02;
    const rating = parseFloat((4.0 + Math.random() * 0.9).toFixed(1));
    const reviewCount = Math.floor(50 + Math.random() * 950);
    const priceLevel = Math.floor(1 + Math.random() * 4) as 1 | 2 | 3 | 4;

    const place: Place = {
      id,
      name,
      type,
      subtypes,
      rating,
      reviewCount,
      priceLevel,
      priceRange: `₹${minPrice.toLocaleString("en-IN")} - ₹${maxPrice.toLocaleString("en-IN")}`,
      address,
      description,
      photos,
      facilities,
      phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
      website: `https://www.explore${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      coordinates: { lat: offsetLat, lng: offsetLng },
      city: cityName,
      state: stateName,
      reviews: []
    };

    if (type === "restaurant" || type === "cafe") {
      place.priceRange = `₹${minPrice.toLocaleString("en-IN")} for two`;
      place.menuHighlights = ["Butter Chicken", "Dal Makhani", "Tandoori Roti", "Garlic Naan"];
      place.popularFoods = ["Paneer Butter Masala", "Chicken Tikka", "Biryani"];
      place.vegFriendly = true;
      place.nonVegFriendly = type === "restaurant";
    } else {
      place.activities = ["Swimming", "Spa treatment", "Yoga session", "Local city tour"];
      place.rooms = [
        { type: "Standard Room", price: `₹${minPrice.toLocaleString("en-IN")}`, amenities: ["Queen Bed", "AC", "WiFi"] },
        { type: "Executive Suite", price: `₹${maxPrice.toLocaleString("en-IN")}`, amenities: ["King Bed", "AC", "WiFi", "Balcony"] }
      ];
    }

    return place;
  };

  const addItems = (type: PlaceType, namesList: string[], count: number) => {
    // Unique list selection
    const usedNames = new Set<string>();
    for (let i = 0; i < count; i++) {
      let suffix = namesList[Math.floor(Math.random() * namesList.length)];
      let attempt = 0;
      while (usedNames.has(suffix) && attempt < 10) {
        suffix = namesList[Math.floor(Math.random() * namesList.length)];
        attempt++;
      }
      usedNames.add(suffix);

      let name = `${cityName} ${suffix}`;
      
      // Dynamic Temple Name Generator
      if (type === "temple") {
        const deities = ["Sri Venkateswara", "Sri Mallikarjuna", "Sri Lakshmi Narasimha", "Sri Veerabhadra", "Sri Ranganatha", "Sri Chennakesava", "Ganesh Mandir", "Siva Devalayam", "Sri Rama Temple", "Durga Mata Mandir", "Sai Baba Shrine"];
        const templeSuffixes = ["Swamy Devasthanam", "Temple Complex", "Heritage Shrine", "Spiritual Ashram", "Hill Temple", "Ancient Mandir"];
        const deity = deities[(cityHash + i) % deities.length];
        const tempSuffix = templeSuffixes[(cityHash + i * 2) % templeSuffixes.length];
        name = `${cityName} ${deity} ${tempSuffix}`;
      }
      
      // Dynamic Lake Attraction Generator (assign first attraction as a lake!)
      if (type === "attraction" && i === 0) {
        const lakeSuffixes = ["Cheruvu (Lake Bund)", "Lake & Boating Ghat", "Water Reservoir & Park", "Scenic Lake Viewpoint", "Freshwater Lake Basin", "Riverbank Canal Walk"];
        const lakeSuffix = lakeSuffixes[(cityHash + i) % lakeSuffixes.length];
        name = `${cityName} ${lakeSuffix}`;
      }

      const id = `mock-${type}-${Math.random().toString(36).substr(2, 9)}`;
      
      let subtypes: string[] = [];
      let desc = "";
      let facilities: string[] = [];
      let photos = getSanitizedPhotos(type, name, cityName, i, photosDb);

      let minP = 500;
      let maxP = 1500;
      let addr = `Near City Center, ${cityName}, ${stateName}`;

      if (type === "hotel") {
        subtypes = ["Luxury Hotels", "Stays", "Boutique Stays"];
        desc = `Experience a luxurious stay at the ${name}, located in the heart of ${cityName}. Featuring premium rooms with air conditioning, complimentary breakfast, ultra-fast WiFi, and round-the-clock room service. Perfect for both business travelers and families seeking standard amenities.`;
        facilities = ["WiFi", "AC", "Breakfast", "Parking", "Gym"];
        minP = 2500;
        maxP = 7500;
      } else if (type === "resort") {
        subtypes = ["Resorts", "Luxury Resorts", "Scenic Stays"];
        desc = `Escape the hustle and bustle of city life at ${name}. Nestled in beautiful, lush surroundings, this premium resort features private cottages, swimming pools, full-service health spas, and guided nature trails. Enjoy exquisite local cuisine and top-tier hospitality.`;
        facilities = ["WiFi", "AC", "Swimming Pool", "Spa", "Breakfast", "Parking"];
        minP = 8000;
        maxP = 22000;
      } else if (type === "restaurant") {
        subtypes = ["Fine Dining", "Family Restaurants", "Local Flavors"];
        desc = `Discover genuine traditional tastes at ${name}, the highly recommended dining place in ${cityName}. We serve legendary local dishes, classic curries, freshly baked breads, and mouth-watering desserts prepared by master chefs using premium local ingredients.`;
        facilities = ["AC", "Parking", "Veg Friendly", "Accepts Cards"];
        minP = 400;
        maxP = 1200;
      } else if (type === "cafe") {
        subtypes = ["Cafes", "Hangout Places", "Coffee Shops"];
        desc = `Relax and unwind at ${name}. A cozy, modern cafe offering coffee, tea, delicious snacks, and a quiet ambiance perfect for reading, remote working, or meeting friends. Features great indoor music and outdoor seating.`;
        facilities = ["WiFi", "AC", "Outdoor Seating", "Veg Friendly"];
        minP = 200;
        maxP = 600;
      } else if (type === "attraction") {
        const isLake = name.toLowerCase().includes("lake") || name.toLowerCase().includes("cheruvu") || name.toLowerCase().includes("reservoir");
        if (isLake) {
          subtypes = ["Scenic Points", "Lakes & Water Bodies", "Boating Ghats"];
          desc = `Visit the beautiful ${name}, a popular and scenic waterfront destination in ${cityName}. Famous for its peaceful nature walks, sunset viewing spots, and recreational boating activities.`;
          facilities = ["Boating", "Scenic Walking Path", "Sunset Viewpoint", "Food Stalls"];
          minP = 0;
          maxP = 150;
        } else {
          subtypes = ["Sightseeing", "Historical Sites", "Famous Landmarks"];
          desc = `Explore the historical and cultural significance of ${name}. This iconic spot offers beautiful architecture, scenic photography angles, and an educational glimpse into the rich history and heritage of ${cityName}. A must-visit place for all tourists.`;
          facilities = ["Parking", "Guided Tours", "Kids Friendly", "Camera Allowed"];
          minP = 50;
          maxP = 250;
        }
      } else if (type === "temple") {
        subtypes = ["Spiritual Sites", "Temples", "Heritage Shrines"];
        desc = `Experience the serene and divine atmosphere at ${name}. A legendary temple complex with ancient architectural carvings, peaceful prayer halls, and rich spiritual history in ${cityName}. Visitors are requested to follow traditional custom guidelines.`;
        facilities = ["Parking", "Guided Tours", "Shoe Keeping Area", "Prasadam Allowed"];
        minP = 0;
        maxP = 250; // VIP Darshan
      }

      list.push(createMock(id, name, type, subtypes, desc, facilities, photos, minP, maxP, addr));
    }
  };

  const cityLowerKey = cityName.toLowerCase().trim();
  const overridesKey = Object.keys(CITY_LANDMARKS).find(key => 
    cityLowerKey === key || 
    cityLowerKey.includes(key) || 
    key.includes(cityLowerKey)
  );
  const overrides = overridesKey ? CITY_LANDMARKS[overridesKey] : undefined;

  if (overrides) {
    if (overrides.temples) {
      overrides.temples.forEach((temple, idx) => {
        const id = `mock-temple-${cityLowerKey}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        const addr = `Temple Road, ${cityName}, ${stateName}`;
        const extraPhotos = getSanitizedPhotos("temple", temple.name, cityName, idx, photosDb);
        const photos = [temple.photo, ...extraPhotos.slice(0, 3)];
        list.push(createMock(id, temple.name, "temple", ["Spiritual Sites", "Temples", "Heritage Shrines"], temple.desc, ["Parking", "Prasadam Allowed", "Shoe Keeping Area"], photos, 0, 250, addr));
      });
    }
    if (overrides.lakes) {
      overrides.lakes.forEach((lake, idx) => {
        const id = `mock-attraction-lake-${cityLowerKey}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        const addr = `Lake Road, ${cityName}, ${stateName}`;
        const extraPhotos = getSanitizedPhotos("lake", lake.name, cityName, idx, photosDb);
        const photos = [lake.photo, ...extraPhotos.slice(0, 3)];
        list.push(createMock(id, lake.name, "attraction", ["Scenic Points", "Lakes & Water Bodies", "Boating Ghats"], lake.desc, ["Boating", "Scenic Walking Path", "Sunset Viewpoint"], photos, 0, 150, addr));
      });
    }
    if (overrides.attractions) {
      overrides.attractions.forEach((attr, idx) => {
        const id = `mock-attraction-${cityLowerKey}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        const addr = `Near City Center, ${cityName}, ${stateName}`;
        const extraPhotos = getSanitizedPhotos("attraction", attr.name, cityName, idx, photosDb);
        const photos = [attr.photo, ...extraPhotos.slice(0, 3)];
        list.push(createMock(id, attr.name, "attraction", ["Sightseeing", "Historical Sites", "Famous Landmarks"], attr.desc, ["Parking", "Guided Tours", "Camera Allowed"], photos, 50, 250, addr));
      });
    }
  }

  const templesCount = Math.max(0, 3 - (overrides?.temples?.length || 0));
  const attractionsCount = Math.max(0, 3 - ((overrides?.lakes?.length || 0) + (overrides?.attractions?.length || 0)));

  addItems("hotel", names.hotel, 3);
  addItems("resort", names.resort, 2);
  addItems("restaurant", names.restaurant, 3);
  addItems("cafe", names.cafe, 2);
  if (attractionsCount > 0) {
    addItems("attraction", names.attraction, attractionsCount);
  }
  if (templesCount > 0) {
    addItems("temple", names.temple, templesCount);
  }

  return list;
}