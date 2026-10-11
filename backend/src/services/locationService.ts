import { fetchWithTimeout, OFFLINE_GEO_DB } from "./geoDataService";

export interface ResolvedLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
  displayName: string;
}

export interface CityWeather {
  temperature: number;
  condition: string;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
}

// Convert Open-Meteo WMO Weather codes to readable condition descriptions
function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear Skies";
  if (code === 1 || code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Misty / Foggy";
  if (code >= 51 && code <= 55) return "Light Drizzle";
  if (code >= 61 && code <= 65) return "Rainy";
  if (code >= 71 && code <= 77) return "Snow Showers";
  if (code >= 80 && code <= 82) return "Passing Showers";
  if (code >= 95 && code <= 99) return "Thunderstorms";
  return "Pleasant";
}

/**
 * Reverse-geocodes latitude and longitude coordinates into a resolved Indian City.
 * First tries Nominatim OpenStreetMap API, then falls back to Euclidean nearest city distance.
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<ResolvedLocation> {
  // 1. Try Nominatim Reverse Geocoding with timeout
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetchWithTimeout(
      osmUrl,
      {
        headers: {
          "User-Agent": "ExploreIndia-App/1.0 (travel@exploreindia.com)",
          "Accept": "application/json"
        }
      },
      2500
    );

    if (res.ok) {
      const data: any = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const cityName =
          addr.city ||
          addr.town ||
          addr.municipality ||
          addr.suburb ||
          addr.county ||
          addr.state_district ||
          addr.village ||
          "";

        const stateName = addr.state || "India";
        const cleanCity = normalizeDetectedCityName(cityName);

        if (cleanCity) {
          return {
            city: cleanCity,
            state: stateName,
            lat,
            lng,
            displayName: data.display_name || `${cleanCity}, ${stateName}`
          };
        }
      }
    }
  } catch (err) {
    console.warn("[locationService] Nominatim reverse geocode timed out or unreachable:", err);
  }

  // 2. Offline nearest city proximity lookup
  let nearestCity = "Hyderabad";
  let nearestState = "Telangana";
  let shortestDist = Infinity;

  for (const [key, info] of Object.entries(OFFLINE_GEO_DB)) {
    const dLat = lat - info.lat;
    const dLng = lng - info.lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < shortestDist) {
      shortestDist = distSq;
      nearestCity = info.name;
      nearestState = info.state;
    }
  }

  return {
    city: nearestCity,
    state: nearestState,
    lat,
    lng,
    displayName: `${nearestCity}, ${nearestState}, India`
  };
}

/**
 * Normalize variations like "Greater Mumbai" -> "Mumbai", "Bangalore Urban" -> "Bangalore"
 */
function normalizeDetectedCityName(raw: string): string {
  if (!raw) return "";
  const lower = raw.toLowerCase().trim();

  if (lower.includes("bengaluru") || lower.includes("bangalore")) return "Bangalore";
  if (lower.includes("mumbai") || lower.includes("bombay")) return "Mumbai";
  if (lower.includes("hyderabad") || lower.includes("secunderabad")) return "Hyderabad";
  if (lower.includes("delhi")) return "Delhi";
  if (lower.includes("kolkata") || lower.includes("calcutta")) return "Kolkata";
  if (lower.includes("chennai") || lower.includes("madras")) return "Chennai";
  if (lower.includes("jaipur")) return "Jaipur";
  if (lower.includes("visakhapatnam") || lower.includes("vizag")) return "Visakhapatnam";
  if (lower.includes("amritsar")) return "Amritsar";
  if (lower.includes("varanasi") || lower.includes("banaras") || lower.includes("kashi")) return "Varanasi";
  if (lower.includes("tirupati") || lower.includes("tirumala")) return "Tirupati";
  if (lower.includes("pune") || lower.includes("poona")) return "Pune";
  if (lower.includes("ahmedabad")) return "Ahmedabad";
  if (lower.includes("agra")) return "Agra";
  if (lower.includes("goa")) return "Goa";

  // Clean trailing "District", "Mandal", "Urban", "Rural"
  const cleaned = raw
    .replace(/\b(District|Mandal|Urban|Rural|Corporation|City|Zone)\b/gi, "")
    .trim();

  return cleaned || raw;
}

/**
 * Fetches real current weather for given city coordinates.
 */
export async function getCityWeather(lat: number, lng: number): Promise<CityWeather> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    const res = await fetchWithTimeout(url, {}, 2500);
    if (res.ok) {
      const data: any = await res.json();
      if (data && data.current_weather) {
        const cw = data.current_weather;
        return {
          temperature: Math.round(cw.temperature),
          condition: getWeatherDescription(cw.weathercode),
          weatherCode: cw.weathercode,
          windSpeed: cw.windspeed,
          isDay: Boolean(cw.is_day)
        };
      }
    }
  } catch (err) {
    // Graceful fallback weather
  }

  return {
    temperature: 28,
    condition: "Sunny & Pleasant",
    weatherCode: 0,
    windSpeed: 8,
    isDay: true
  };
}
