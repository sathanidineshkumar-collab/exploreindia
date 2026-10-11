import { getApiUrl } from "./api";

export interface DetectedLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
  displayName: string;
}

export interface CityWeatherData {
  temperature: number;
  condition: string;
  weatherCode: number;
  windSpeed: number;
}

const LOCATION_DENIED_KEY = "explore_india_geo_denied";

export const locationService = {
  /**
   * Checks if user has previously denied location permission in this session.
   */
  hasUserDeniedLocation(): boolean {
    try {
      return sessionStorage.getItem(LOCATION_DENIED_KEY) === "true";
    } catch {
      return false;
    }
  },

  /**
   * Sets location denied flag to avoid repeated nag prompts.
   */
  setUserDeniedLocation(): void {
    try {
      sessionStorage.setItem(LOCATION_DENIED_KEY, "true");
    } catch {
      // ignore
    }
  },

  /**
   * Clears denied flag when user explicitly clicks "Detect My Location" button.
   */
  clearUserDeniedLocation(): void {
    try {
      sessionStorage.removeItem(LOCATION_DENIED_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Obtains raw latitude and longitude from browser navigator.geolocation.
   */
  async getCurrentCoordinates(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by your browser."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            locationService.setUserDeniedLocation();
          }
          reject(new Error(error.message || "Failed to retrieve device location."));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });
  },

  /**
   * Reverse-geocodes coordinates into a detected city using backend endpoint.
   */
  async reverseGeocode(lat: number, lng: number): Promise<DetectedLocation> {
    const res = await fetch(getApiUrl("/api/location/reverse-geocode"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng })
    });

    if (!res.ok) {
      throw new Error(`Reverse geocoding failed with status ${res.status}`);
    }

    return res.json();
  },

  /**
   * One-step detection of user location and city.
   */
  async detectUserCity(): Promise<DetectedLocation> {
    locationService.clearUserDeniedLocation();
    const coords = await locationService.getCurrentCoordinates();
    return locationService.reverseGeocode(coords.lat, coords.lng);
  },

  /**
   * Fetches real current weather for city coordinates.
   */
  async getWeather(lat: number, lng: number): Promise<CityWeatherData | null> {
    try {
      const res = await fetch(getApiUrl(`/api/location/weather?lat=${lat}&lng=${lng}`));
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      console.warn("Weather fetch failed:", err);
    }
    return null;
  }
};
