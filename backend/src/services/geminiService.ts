import { GoogleGenAI, Type } from "@google/genai";
import { ENV } from "../config/env";
import { Place } from "../models/types";

let ai: GoogleGenAI | null = null;

if (ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim() !== "" && ENV.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: ENV.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("[GeminiService] Initialized GoogleGenAI client successfully.");
  } catch (err) {
    console.error("[GeminiService] Failed to initialize GoogleGenAI client:", err);
  }
} else {
  console.warn("[GeminiService] GEMINI_API_KEY is not set or placeholder. Backend will use offline mock engine.");
}

export interface GeminiDiscoveryResult {
  city: {
    name: string;
    state: string;
    lat: number;
    lng: number;
  };
  places: Place[];
}

export async function discoverWithGemini(
  query: string,
  clientLat?: number | null,
  clientLng?: number | null
): Promise<GeminiDiscoveryResult | null> {
  if (!ai) {
    return null;
  }

  const clientLatHint = clientLat || null;
  const clientLngHint = clientLng || null;

  const prompt = `You are a world-class Indian travel concierge, geocoder, and food guide.
Analyze this search query: "${query}"
We need to resolve this query to a specific city/town/region in India, get its coordinates (lat/lng), and generate exactly 12-15 highly realistic, premium places matching the user's needs.

CRITICAL LOCATION HINT:
- If we already have coordinates hint: Lat: ${clientLatHint || "None"}, Lng: ${clientLngHint || "None"}, please use them or estimate around them.
- If no coordinates are hinted, use your accurate geographical knowledge to provide the correct central coordinates (lat/lng) for the detected city/town/region in India (e.g. Goa, Hyderabad, Anantapur, Coorg).

Analyze what specific travel, dining, or accommodation needs the user is expressing (e.g., "biryani spots", "budget homestays", "spa resorts", "vegetarian food", "heritage temples"). If they just entered a city name, keep this general. Customize the generated places to align directly with what the user is looking for! For example:
- If they asked for Biryani, produce legendary local Biryani specialty spots, family restaurants, and fine-dining places famous for it.
- If they wanted budget options, produce clean budget-friendly homestays, hotels, or cafes with realistic prices in Rupees.
- If they wanted resorts, focus heavily on magnificent local resorts with wonderful local activities.

Generate a beautiful, curated list of EXACTLY 12-15 highly realistic, premium places in the city/town that satisfy the user's specific needs.
Each generated place MUST match one of the standard category types: 'hotel' | 'restaurant' | 'resort' | 'attraction' | 'cafe'.

Ensure that:
- Each place has genuine names from the target location or nearby areas. Do NOT make up random English names if it's a rustic village.
- Add details like accurate addresses, beautiful descriptions (100-150 words showcasing local flair), rating (4.0 - 4.9), reviewCount (50 - 2000), priceLevel (1 to 4 stars representing ₹ to ₹₹₹₹), priceRange (in Indian Rupees, e.g. "₹5,000 - ₹12,000 per night" or "₹400 for two"), real-style Indian phone numbers, and websites (realistic domains like .in, .com).
- Set custom coordinates slightly offset from the central city coordinates so they spread nicely on a map (around 0.005 to 0.05 difference).
- Include robust amenities (e.g., 'WiFi', 'Swimming Pool', 'Parking', 'AC', 'Breakfast', 'Pet Friendly').
- For resorts, add lists of beautiful activities ('Yoga', 'Spa', 'Safari', 'Trekking') and room tiers.
- For restaurants, list menu highlights and popular foods (e.g. 'Butter Chicken', 'Hyderabadi Biryani', 'Masala Dosa').
- For photos, use premium Unsplash image URLs that render stunning travel architecture, hotel bedrooms, Indian foods, pools, beaches, and landscapes. Make sure the URLs are valid.

Return strictly a JSON object with this exact typescript structure:
{
  "city": {
    "name": "Name of the city/town/region (e.g. Anantapur, Hyderabad, Goa)",
    "state": "Name of the state (e.g. Andhra Pradesh, Telangana, Goa)",
    "lat": number (e.g. 14.6819),
    "lng": number (e.g. 77.6006)
  },
  "places": Array<Place>
}

Do not return any markdown formatting outside the JSON block. Start output with "{" and end with "}".`;

  try {
    const aiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["city", "places"],
          properties: {
            city: {
              type: Type.OBJECT,
              required: ["name", "state", "lat", "lng"],
              properties: {
                name: { type: Type.STRING },
                state: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              }
            },
            places: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "name", "type", "subtypes", "rating", "reviewCount", "priceLevel", "address", "description", "photos", "facilities", "coordinates"],
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Must be 'hotel' | 'restaurant' | 'resort' | 'attraction' | 'cafe'" },
                  subtypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rating: { type: Type.NUMBER },
                  reviewCount: { type: Type.INTEGER },
                  priceLevel: { type: Type.INTEGER },
                  priceRange: { type: Type.STRING },
                  address: { type: Type.STRING },
                  description: { type: Type.STRING },
                  photos: { type: Type.ARRAY, items: { type: Type.STRING } },
                  facilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  phone: { type: Type.STRING },
                  website: { type: Type.STRING },
                  coordinates: {
                    type: Type.OBJECT,
                    required: ["lat", "lng"],
                    properties: {
                      lat: { type: Type.NUMBER },
                      lng: { type: Type.NUMBER }
                    }
                  },
                  openHours: { type: Type.STRING },
                  menuHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  popularFoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                  vegFriendly: { type: Type.BOOLEAN },
                  nonVegFriendly: { type: Type.BOOLEAN },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rooms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["type", "price", "amenities"],
                      properties: {
                        type: { type: Type.STRING },
                        price: { type: Type.STRING },
                        amenities: { type: Type.ARRAY, items: { type: Type.STRING } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(aiRes.text || "{}");
    if (!parsed.city || !parsed.places) {
      return null;
    }
    return parsed as GeminiDiscoveryResult;
  } catch (error: any) {
    console.error("[GeminiService] Error during discovery generation:", error?.message || error);
    return null;
  }
}
