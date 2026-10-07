import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";
import { Place } from "../models/types";
import { discoverWithGemini } from "../services/geminiService";
import {
  OFFLINE_GEO_DB,
  resolveQueryMetadata,
  getSanitizedPhotos,
  getCityDescription,
  getCityImage,
  generateMockPlaces,
  fetchWithTimeout
} from "../services/geoDataService";

export async function discoverPlaces(req: Request, res: Response) {
  const { query, lat: clientLat, lng: clientLng } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query city/state/town is required" });
  }

  const queryLower = query.toLowerCase().trim();
  const { cityName: parsedCity, suggestedTab } = resolveQueryMetadata(query);
  const parsedCityLower = parsedCity.toLowerCase();

  try {
    // 1. Direct Cache lookup for simple queries & known cities
    const foundCity = db.cities.find((c) =>
      parsedCityLower === c.name.toLowerCase() ||
      c.name.toLowerCase().includes(parsedCityLower) ||
      queryLower.includes(c.name.toLowerCase())
    );

    if (foundCity) {
      const cached = db.places.filter((p) => p.city.toLowerCase() === foundCity.name.toLowerCase());
      const isSpecializedQuery =
        queryLower.split(/\s+/).length > 2 &&
        !queryLower.includes("hotel") &&
        !queryLower.includes("food");

      if (cached.length >= 6 && !isSpecializedQuery) {
        return res.json({
          city: foundCity,
          places: cached,
          suggestedTab
        });
      }
    } else {
      const matchedCityPlace = db.places.find(
        (p) =>
          parsedCityLower === p.city.toLowerCase() ||
          p.city.toLowerCase().includes(parsedCityLower) ||
          queryLower.includes(p.city.toLowerCase())
      );
      if (matchedCityPlace) {
        const targetCityName = matchedCityPlace.city;
        const cached = db.places.filter((p) => p.city.toLowerCase() === targetCityName.toLowerCase());
        const cityDetails = db.cities.find((c) => c.name.toLowerCase() === targetCityName.toLowerCase());
        return res.json({
          city: {
            name: targetCityName,
            state: matchedCityPlace.state,
            lat: matchedCityPlace.coordinates.lat,
            lng: matchedCityPlace.coordinates.lng,
            image:
              cityDetails?.image ||
              cached.find((p) => p.photos && p.photos.length > 0)?.photos[0] ||
              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600",
            description:
              cityDetails?.description ||
              `Explore the beautiful city of ${targetCityName} in ${matchedCityPlace.state}.`
          },
          places: cached,
          suggestedTab
        });
      }
    }

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

    let lat = clientLat ? parseFloat(clientLat as any) : null;
    let lng = clientLng ? parseFloat(clientLng as any) : null;
    let locationName = query;
    let state = "India";

    // 2. Try Gemini API if enabled
    const geminiResult = await discoverWithGemini(query, lat, lng);
    if (geminiResult && geminiResult.places && geminiResult.places.length > 0) {
      locationName = geminiResult.city.name || query;
      state = geminiResult.city.state || "India";
      lat = geminiResult.city.lat || 20.5937;
      lng = geminiResult.city.lng || 78.9629;

      const enrichedPlaces: Place[] = geminiResult.places.map((p: any, idx: number) => ({
        ...p,
        photos: getSanitizedPhotos(p.type || "attraction", p.name || "", locationName, idx),
        city: locationName,
        state: state,
        reviews: []
      }));

      // Cache places in local database
      enrichedPlaces.forEach((p) => {
        const exists = db.places.find((dp) => dp.name.toLowerCase() === p.name.toLowerCase());
        if (!exists) {
          db.places.push(p);
        }
      });

      const cityExists = db.cities.find((c) => c.name.toLowerCase() === locationName.toLowerCase());
      if (!cityExists && enrichedPlaces.length > 0) {
        db.cities.push({
          name: locationName,
          state,
          description: getCityDescription(locationName, state),
          image: getCityImage(locationName),
          lat: lat!,
          lng: lng!
        });
      }

      saveDatabase(db);

      const cityDetails = db.cities.find((c) => c.name.toLowerCase() === locationName.toLowerCase());
      return res.json({
        city: {
          name: locationName,
          state: state,
          lat: lat!,
          lng: lng!,
          image: cityDetails?.image || getCityImage(locationName),
          description: cityDetails?.description || getCityDescription(locationName, state)
        },
        places: enrichedPlaces,
        suggestedTab
      });
    }

    // 3. Fallback Offline Mock Generation
    console.log(`[Mock Fallback] Generating offline mock data for query: "${query}" (clean: "${parsedCity}")`);
    if (foundCity) {
      locationName = foundCity.name;
      state = foundCity.state;
      lat = foundCity.lat;
      lng = foundCity.lng;
    } else {
      const offlineGeo = OFFLINE_GEO_DB[parsedCityLower];
      if (offlineGeo) {
        locationName = offlineGeo.name;
        state = offlineGeo.state;
        lat = offlineGeo.lat;
        lng = offlineGeo.lng;
      } else {
        // Geocode via Nominatim
        let resolved = false;
        try {
          const osmRes = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(parsedCity + ", India")}&format=json&limit=1`,
            { headers: { "User-Agent": "ExploreIndia-App" } },
            2000
          );
          if (osmRes.ok) {
            const osmData: any = await osmRes.json();
            if (osmData && osmData.length > 0) {
              const first = osmData[0];
              lat = parseFloat(first.lat);
              lng = parseFloat(first.lon);
              locationName = parsedCity;

              const parts = first.display_name.split(", ");
              if (parts.length > 2) {
                state = parts[parts.length - 2];
              } else {
                state = "India";
              }
              resolved = true;
            }
          }
        } catch (osmError) {
          console.error("OSM Geocoding failed:", osmError);
        }

        if (!resolved) {
          locationName = parsedCity;
          state = "India";
          lat = lat || 20.5937;
          lng = lng || 78.9629;
        }
      }
    }

    let fallbackPlaces = db.places.filter((p) => p.city.toLowerCase() === locationName.toLowerCase());
    if (fallbackPlaces.length < 6) {
      const generated = generateMockPlaces(locationName, state, lat!, lng!, query);
      generated.forEach((p) => {
        const exists = db.places.find((dp) => dp.name.toLowerCase() === p.name.toLowerCase());
        if (!exists) {
          db.places.push(p);
          fallbackPlaces.push(p);
        }
      });

      const cityExists = db.cities.find((c) => c.name.toLowerCase() === locationName.toLowerCase());
      if (!cityExists) {
        db.cities.push({
          name: locationName,
          state,
          description: getCityDescription(locationName, state),
          image: getCityImage(locationName),
          lat: lat!,
          lng: lng!
        });
      }
      saveDatabase(db);
    }

    const cityDetails = db.cities.find((c) => c.name.toLowerCase() === locationName.toLowerCase());
    return res.json({
      city: {
        name: locationName,
        state,
        lat: lat!,
        lng: lng!,
        image: cityDetails?.image || getCityImage(locationName),
        description: cityDetails?.description || getCityDescription(locationName, state)
      },
      places: fallbackPlaces,
      suggestedTab
    });
  } catch (error: any) {
    console.error("Discovery API Error:", error);
    res.status(500).json({ error: error.message || "Failed to search and enrich locations" });
  }
}

export function getTrendingPlaces(req: Request, res: Response) {
  res.json(db.places);
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
  res.json(db.cities.slice(0, 6));
}

export function getFamousHotels(req: Request, res: Response) {
  const famousNames = [
    "Taj Falaknuma Palace",
    "The Taj Mahal Palace",
    "Taj Exotica Resort & Spa",
    "The Leela Palace Bangalore",
    "The Raj Palace Hotel",
    "The Oberoi New Delhi",
    "W Goa"
  ];
  const list = db.places.filter((p) => famousNames.some((name) => p.name.toLowerCase().includes(name.toLowerCase())));
  const uniqueList: typeof list = [];
  const namesSeen = new Set<string>();
  for (const item of list) {
    if (!namesSeen.has(item.name)) {
      namesSeen.add(item.name);
      uniqueList.push(item);
    }
  }
  res.json(uniqueList.slice(0, 6));
}

export function getTravelTips(req: Request, res: Response) {
  res.json(db.travelTips);
}
