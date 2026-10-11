import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";
import { Place, CityInfo, DiscoverResponse } from "../models/types";
import { discoverWithGemini } from "../services/geminiService";
import {
  OFFLINE_GEO_DB,
  resolveQueryMetadata,
  getCityDescription,
  generateMockPlaces,
  fetchWithTimeout
} from "../services/geoDataService";
import {
  getCityHeroImage,
  getCityImage,
  getPlacePhotos,
  CITY_LANDMARK_REGISTRY
} from "../services/imageService";
import { CURATED_CITIES } from "../services/curatedCatalog";
import { reverseGeocodeCoordinates, getCityWeather } from "../services/locationService";
import { dbEngine } from "../services/databaseEngine";
import { parseSearchIntent } from "../services/searchEngine";
import { fetchOsmPlacesForCity } from "../services/osmService";
import { COMPREHENSIVE_INDIAN_DESTINATIONS } from "../services/destinationDatabase";

// Initialize destination database on startup
(function initializeDestinationRegistry() {
  try {
    dbEngine.bulkImport(COMPREHENSIVE_INDIAN_DESTINATIONS, "curated-registry");
  } catch (err) {
    console.warn("Failed to auto-seed comprehensive destination database:", err);
  }
})();

/**
 * Discover places for a given city or query.
 * Enhanced with full India-wide database querying, 17-category support, and pagination.
 */
export async function discoverPlaces(req: Request, res: Response) {
  const {
    query,
    lat: clientLat,
    lng: clientLng,
    category,
    type,
    page = 1,
    limit = 24,
    sortBy,
    priceLevel,
    minRating,
    facilities,
    vegOnly,
    nonVegOnly
  } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Search query city/state/town is required" });
  }

  const queryLower = query.toLowerCase().trim();
  const intent = parseSearchIntent(query);
  const { cityName: parsedCity, suggestedTab: defaultSuggestedTab } = resolveQueryMetadata(query);
  const suggestedTab = intent.suggestedTab || defaultSuggestedTab || "all";

  try {
    // Save search query to history if user-id header provided
    const userId = (req.headers["x-user-id"] as string) || "anonymous";
    if (userId && userId !== "anonymous") {
      db.searchHistory.push({
        id: "sh-" + Math.random().toString(36).substr(2, 9),
        userId,
        query: query,
        timestamp: new Date().toISOString()
      });
      if (db.searchHistory.length > 200) {
        db.searchHistory.shift();
      }
      saveDatabase(db);
    }

const STATE_HUBS: Record<string, { city: string; state: string; lat: number; lng: number }> = {
  "rajasthan": { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  "kerala": { city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  "goa": { city: "Goa", state: "Goa", lat: 15.2993, lng: 74.1240 },
  "punjab": { city: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723 },
  "uttar pradesh": { city: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  "tamil nadu": { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  "karnataka": { city: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  "telangana": { city: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  "maharashtra": { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  "west bengal": { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  "gujarat": { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  "delhi": { city: "Delhi", state: "Delhi", lat: 28.7041, lng: 77.1025 },
  "himachal pradesh": { city: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  "uttarakhand": { city: "Rishikesh", state: "Uttarakhand", lat: 30.0869, lng: 78.2676 },
  "jammu & kashmir": { city: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973 },
  "ladakh": { city: "Leh", state: "Ladakh", lat: 34.1526, lng: 77.5771 },
  "odisha": { city: "Puri", state: "Odisha", lat: 19.8135, lng: 85.8312 },
  "assam": { city: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
  "meghalaya": { city: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933 }
};

    // Determine target location (City and/or State)
    let targetCityName = intent.cityName;
    let targetStateName = intent.stateName;

    // Handle state-wide natural queries (e.g., "forts in Rajasthan", "waterfalls in Kerala")
    const isStateWideQuery = !!targetStateName && !targetCityName;
    if (isStateWideQuery && targetStateName) {
      const hub = STATE_HUBS[targetStateName.toLowerCase()];
      if (hub) {
        targetCityName = hub.city;
      }
    }

    if (!targetCityName) {
      targetCityName = parsedCity;
    }

    // 1. Check Curated Cities Aliases
    for (const [key, entry] of Object.entries(CURATED_CITIES)) {
      const match =
        entry.aliases.some((alias) => queryLower.includes(alias) || targetCityName.toLowerCase() === alias) ||
        entry.city.name.toLowerCase() === targetCityName.toLowerCase() ||
        queryLower.includes(entry.city.name.toLowerCase());

      if (match) {
        targetCityName = entry.city.name;
        targetStateName = entry.city.state;
        break;
      }
    }

    // Resolve City Information
    let resolvedCity: CityInfo | null = null;
    const existingCity = db.cities.find((c) => c.name.toLowerCase() === targetCityName.toLowerCase());

    if (existingCity) {
      resolvedCity = {
        ...existingCity,
        image: getCityHeroImage(existingCity.name) || existingCity.image
      };
      targetStateName = existingCity.state;
    } else {
      const offlineGeo = OFFLINE_GEO_DB[targetCityName.toLowerCase()];
      if (offlineGeo) {
        resolvedCity = {
          name: offlineGeo.name,
          state: offlineGeo.state,
          lat: offlineGeo.lat,
          lng: offlineGeo.lng,
          image: getCityHeroImage(offlineGeo.name),
          description: getCityDescription(offlineGeo.name, offlineGeo.state)
        };
        targetStateName = offlineGeo.state;
      }
    }

    // If city is not in offline DB, try client coordinates or Nominatim geocoding
    if (!resolvedCity) {
      let lat = clientLat ? parseFloat(clientLat as any) : null;
      let lng = clientLng ? parseFloat(clientLng as any) : null;

      if (!lat || !lng) {
        try {
          const osmRes = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(targetCityName + ", India")}&format=json&limit=1`,
            { headers: { "User-Agent": "ExploreIndia-App" } },
            2000
          );
          if (osmRes.ok) {
            const osmData: any = await osmRes.json();
            if (osmData && osmData.length > 0) {
              lat = parseFloat(osmData[0].lat);
              lng = parseFloat(osmData[0].lon);
              const parts = osmData[0].display_name.split(", ");
              targetStateName = parts.length > 2 ? parts[parts.length - 2] : "India";
            }
          }
        } catch {
          // ignore
        }
      }

      resolvedCity = {
        name: targetCityName,
        state: targetStateName || "India",
        lat: lat || 20.5937,
        lng: lng || 78.9629,
        image: getCityHeroImage(targetCityName),
        description: getCityDescription(targetCityName, targetStateName || "India")
      };
    }

    // Query Database Engine with full indexing and pagination
    let searchResult = dbEngine.queryPlaces({
      city: isStateWideQuery ? undefined : targetCityName,
      state: targetStateName,
      category: category || intent.category,
      type,
      search: intent.cleanQuery,
      priceLevel: priceLevel ? Number(priceLevel) : intent.priceLevel,
      minRating: minRating ? Number(minRating) : undefined,
      facilities,
      vegOnly,
      nonVegOnly,
      sortBy,
      page: Number(page),
      limit: Number(limit)
    });

    // If database has very few places (< 6) for this city, dynamically fetch from OpenStreetMap Overpass
    if (searchResult.total < 6 && resolvedCity.lat && resolvedCity.lng) {
      try {
        const osmPlaces = await fetchOsmPlacesForCity(
          resolvedCity.name,
          resolvedCity.state,
          resolvedCity.lat,
          resolvedCity.lng,
          25000,
          20
        );

        if (osmPlaces.length > 0) {
          dbEngine.bulkImport(osmPlaces, "osm-overpass");
          // Re-query with freshly imported OpenStreetMap places
          searchResult = dbEngine.queryPlaces({
            city: targetCityName,
            state: targetStateName,
            category: category || intent.category,
            type,
            search: intent.cleanQuery,
            priceLevel: priceLevel ? Number(priceLevel) : intent.priceLevel,
            minRating: minRating ? Number(minRating) : undefined,
            facilities,
            vegOnly,
            nonVegOnly,
            sortBy,
            page: Number(page),
            limit: Number(limit)
          });
        }
      } catch (osmErr) {
        console.warn("OSM enrichment failed gracefully:", osmErr);
      }
    }

    // Fallback: If still 0 places exist, generate verified mock places with unique photos
    if (searchResult.total === 0) {
      const generated = generateMockPlaces(
        resolvedCity.name,
        resolvedCity.state,
        resolvedCity.lat,
        resolvedCity.lng,
        query
      );
      const usedImages = new Set<string>();
      const enrichedGenerated = generated.map((p) => {
        const photos = getPlacePhotos(resolvedCity!.name, p.name, p.type, usedImages, 2);
        return {
          ...p,
          photos
        };
      });

      dbEngine.bulkImport(enrichedGenerated, "generated-fallback");
      searchResult = dbEngine.queryPlaces({
        city: targetCityName,
        category: category || intent.category,
        page: Number(page),
        limit: Number(limit)
      });
    }

    // Ensure resolved city is stored in db.cities
    const cityExists = db.cities.find((c) => c.name.toLowerCase() === resolvedCity!.name.toLowerCase());
    if (!cityExists) {
      db.cities.push(resolvedCity);
      saveDatabase(db);
    }

    // Construct response containing both paginated places and complete discovery metadata
    const response: DiscoverResponse = {
      city: resolvedCity,
      places: searchResult.places,
      total: searchResult.total,
      page: searchResult.page,
      limit: searchResult.limit,
      totalPages: searchResult.totalPages,
      hasNextPage: searchResult.hasNextPage,
      hasPrevPage: searchResult.hasPrevPage,
      categoryCounts: searchResult.categoryCounts,
      suggestedTab
    };

    return res.json(response);
  } catch (error: any) {
    console.error("Discovery API Error:", error);
    res.status(500).json({ error: error.message || "Failed to search and enrich locations" });
  }
}

/**
 * Filterable, searchable, and paginated Places list endpoint (GET /api/places)
 */
export function getPlacesList(req: Request, res: Response) {
  const {
    city,
    state,
    category,
    type,
    search,
    page = 1,
    limit = 24,
    sortBy,
    priceLevel,
    minRating,
    vegOnly,
    nonVegOnly
  } = req.query;

  const result = dbEngine.queryPlaces({
    city: city as string,
    state: state as string,
    category: category as string,
    type: type as string,
    search: search as string,
    page: Number(page),
    limit: Number(limit),
    sortBy: sortBy as any,
    priceLevel: priceLevel ? Number(priceLevel) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    vegOnly: vegOnly === "true",
    nonVegOnly: nonVegOnly === "true"
  });

  res.json(result);
}

/**
 * Category breakdown stats endpoint (GET /api/places/categories)
 */
export function getCategoryStats(req: Request, res: Response) {
  const city = req.query.city as string;
  const state = req.query.state as string;
  const search = req.query.search as string;

  const result = dbEngine.queryPlaces({
    city,
    state,
    search,
    limit: 1000
  });

  res.json(result.categoryCounts);
}

/**
 * Bulk import endpoint for external synchronization (POST /api/places/import)
 */
export async function importPlacesHandler(req: Request, res: Response) {
  const { city, lat, lng, radius = 25000, places, source = "osm-overpass" } = req.body;

  try {
    if (Array.isArray(places) && places.length > 0) {
      const summary = dbEngine.bulkImport(places, source);
      return res.json({ success: true, summary });
    }

    if (city && lat && lng) {
      const osmPlaces = await fetchOsmPlacesForCity(
        city,
        "India",
        Number(lat),
        Number(lng),
        Number(radius),
        50
      );
      const summary = dbEngine.bulkImport(osmPlaces, "osm-overpass");
      return res.json({ success: true, summary });
    }

    return res.status(400).json({ error: "Provide either a 'places' array or 'city', 'lat', and 'lng'" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Import failed" });
  }
}

export function getTrendingPlaces(req: Request, res: Response) {
  const result = dbEngine.queryPlaces({ limit: 12, sortBy: "featured" });
  res.json(result.places);
}

export function getPlaceById(req: Request, res: Response) {
  const { id } = req.params;
  const place = db.places.find((p) => p.id === id);
  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  const placeReviews = db.reviews.filter((r) => r.placeId === id && r.approved);
  res.json({
    ...place,
    reviews: placeReviews
  });
}

export function getTrendingCities(req: Request, res: Response) {
  const curatedKeys = ["hyderabad", "bangalore", "mumbai", "delhi", "goa", "jaipur"];
  const list = curatedKeys
    .map((k) => CURATED_CITIES[k]?.city)
    .filter(Boolean)
    .concat(db.cities.filter((c) => !curatedKeys.includes(c.name.toLowerCase())));

  res.json(list.slice(0, 6));
}

export function getFamousHotels(req: Request, res: Response) {
  const famousNames = [
    "Taj Falaknuma Palace",
    "The Taj Mahal Palace",
    "Taj Exotica Resort & Spa",
    "The Leela Palace Bangalore",
    "The Raj Palace Hotel",
    "The Oberoi New Delhi",
    "Taj Lake Palace",
    "W Goa"
  ];
  const list = db.places.filter((p) =>
    famousNames.some((name) => p.name.toLowerCase().includes(name.toLowerCase()))
  );
  const uniqueList: typeof list = [];
  const namesSeen = new Set<string>();
  for (const item of list) {
    if (!namesSeen.has(item.name)) {
      namesSeen.add(item.name);
      uniqueList.push(item);
    }
  }
  res.json(uniqueList.slice(0, 8));
}

export function getTravelTips(req: Request, res: Response) {
  res.json(db.travelTips);
}

/**
 * Reverse Geocode Endpoint (POST /api/location/reverse-geocode)
 */
export async function reverseGeocodeLocation(req: Request, res: Response) {
  const { lat, lng } = req.body;
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const resolved = await reverseGeocodeCoordinates(Number(lat), Number(lng));
    res.json(resolved);
  } catch (error: any) {
    console.error("Reverse geocode error:", error);
    res.status(500).json({ error: "Failed to reverse geocode coordinates" });
  }
}

/**
 * City Weather Endpoint (GET /api/location/weather)
 */
export async function getCityWeatherHandler(req: Request, res: Response) {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng query parameters are required" });
  }

  try {
    const weather = await getCityWeather(Number(lat), Number(lng));
    res.json(weather);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch city weather" });
  }
}

/**
 * Dynamic Image Retrieval Endpoint (GET /api/images)
 */
export async function getCityImageHandler(req: Request, res: Response) {
  const city = (req.query.city as string) || "Hyderabad";
  const feature = (req.query.feature as string) || (req.query.place as string) || "";
  const category = (req.query.category as string) || "attraction";

  try {
    const imageUrl = await getCityImage(city, feature || category);
    const photos = getPlacePhotos(city, feature, category, new Set(), 3);
    res.json({
      city,
      feature,
      query: `${city} ${feature || category}`.trim(),
      imageUrl,
      photos
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to resolve city image" });
  }
}
