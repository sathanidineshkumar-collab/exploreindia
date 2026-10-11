import { Router } from "express";
import {
  discoverPlaces,
  getTrendingPlaces,
  getPlaceById,
  getFamousHotels,
  getTrendingCities,
  getTravelTips,
  reverseGeocodeLocation,
  getCityWeatherHandler,
  getCityImageHandler,
  getPlacesList,
  getCategoryStats,
  importPlacesHandler
} from "../controllers/placeController";

const router = Router();

// Discovery
router.post("/discover", discoverPlaces);

// Location & Geocoding
router.post("/location/reverse-geocode", reverseGeocodeLocation);
router.get("/location/weather", getCityWeatherHandler);

// Dynamic City Images
router.get("/images", getCityImageHandler);

// Places endpoints
router.get("/places", getPlacesList);
router.get("/places/categories", getCategoryStats);
router.post("/places/import", importPlacesHandler);
router.get("/places/trending", getTrendingPlaces);
router.get("/places/:id", getPlaceById);

// Public curated lists
router.get("/hotels/famous", getFamousHotels);
router.get("/cities/trending", getTrendingCities);
router.get("/tips", getTravelTips);

export default router;
