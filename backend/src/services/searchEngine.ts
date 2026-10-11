import { resolveQueryMetadata, KNOWN_INDIAN_CITIES, LANDMARK_TO_CITY } from "./geoDataService";
import { db } from "../config/db";

export interface ParsedSearchIntent {
  cityName?: string;
  stateName?: string;
  category?: string;
  cleanQuery?: string;
  priceLevel?: number;
  suggestedTab?: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Jammu & Kashmir", "Ladakh", "Delhi", "Puducherry", "Chandigarh"
];

/**
 * Parses user search query to detect intended destination and category
 */
export function parseSearchIntent(query: string): ParsedSearchIntent {
  const qLower = query.toLowerCase().trim();
  let category: string | undefined;
  let priceLevel: number | undefined;
  let suggestedTab: string | undefined;

  // 1. Detect Category & Tab Intent
  if (qLower.includes("temple") || qLower.includes("mandir") || qLower.includes("shrine") || qLower.includes("darshan")) {
    category = "temple";
    suggestedTab = "temples";
  } else if (qLower.includes("fort") || qLower.includes("palace") || qLower.includes("heritage") || qLower.includes("monument")) {
    category = "heritage";
    suggestedTab = "tourism";
  } else if (qLower.includes("beach") || qLower.includes("coast") || qLower.includes("sea")) {
    category = "beach";
    suggestedTab = "tourism";
  } else if (qLower.includes("waterfall") || qLower.includes("falls") || qLower.includes("lake") || qLower.includes("river")) {
    category = "waterfall";
    suggestedTab = "tourism";
  } else if (qLower.includes("wildlife") || qLower.includes("safari") || qLower.includes("sanctuary") || qLower.includes("zoo") || qLower.includes("national park")) {
    category = "wildlife";
    suggestedTab = "tourism";
  } else if (qLower.includes("hotel") || qLower.includes("resort") || qLower.includes("stay") || qLower.includes("villa") || qLower.includes("lodge")) {
    category = "hotel";
    suggestedTab = "stays";
    if (qLower.includes("luxury") || qLower.includes("5 star") || qLower.includes("palatial")) {
      priceLevel = 4;
    } else if (qLower.includes("budget") || qLower.includes("cheap")) {
      priceLevel = 2;
    }
  } else if (qLower.includes("restaurant") || qLower.includes("food") || qLower.includes("eat") || qLower.includes("dine") || qLower.includes("cafe") || qLower.includes("biryani") || qLower.includes("dosa")) {
    category = "restaurant";
    suggestedTab = "food";
  } else if (qLower.includes("market") || qLower.includes("bazaar") || qLower.includes("shopping") || qLower.includes("mall")) {
    category = "market";
    suggestedTab = "tourism";
  } else if (qLower.includes("museum") || qLower.includes("gallery")) {
    category = "museum";
    suggestedTab = "tourism";
  }

  // 2. Detect State if explicitly mentioned (e.g., "forts in Rajasthan", "waterfalls in Kerala")
  let stateName: string | undefined;
  for (const st of INDIAN_STATES) {
    if (qLower.includes(st.toLowerCase())) {
      stateName = st;
      break;
    }
  }

  // 3. Detect City using Landmark, GeoData, and Database matching
  let cityName: string | undefined;

  // Check known landmark triggers
  for (const [landmark, info] of Object.entries(LANDMARK_TO_CITY)) {
    if (qLower.includes(landmark)) {
      cityName = info.city;
      if (!suggestedTab && info.tab) suggestedTab = info.tab;
      break;
    }
  }

  // Check database cities
  if (!cityName) {
    const matchedDbCity = (db.cities || []).find((c) => {
      const cName = c.name.toLowerCase();
      return (
        qLower === cName ||
        qLower.includes(`in ${cName}`) ||
        qLower.includes(`of ${cName}`) ||
        qLower.includes(`near ${cName}`) ||
        qLower.split(/\s+/).includes(cName)
      );
    });

    if (matchedDbCity) {
      cityName = matchedDbCity.name;
    }
  }

  // Fallback to geo metadata resolver
  if (!cityName && !stateName) {
    const meta = resolveQueryMetadata(query);
    cityName = meta.cityName;
  }

  // Clean Query for token matching
  let cleanQuery = qLower;
  if (cityName) cleanQuery = cleanQuery.replace(cityName.toLowerCase(), "");
  if (stateName) cleanQuery = cleanQuery.replace(stateName.toLowerCase(), "");
  cleanQuery = cleanQuery.replace(/\b(in|of|near|at|famous|best|top|all|the|places|visit)\b/g, "").trim();

  return {
    cityName,
    stateName,
    category,
    cleanQuery: cleanQuery.length > 2 ? cleanQuery : undefined,
    priceLevel,
    suggestedTab
  };
}
