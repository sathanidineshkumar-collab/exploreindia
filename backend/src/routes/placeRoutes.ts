import { Router } from "express";
import {
  discoverPlaces,
  getTrendingPlaces,
  getPlaceById,
  getFamousHotels,
  getTrendingCities,
  getTravelTips
} from "../controllers/placeController";

const router = Router();

// Discovery
router.post("/discover", discoverPlaces);

// Places endpoints
router.get("/places/trending", getTrendingPlaces);
router.get("/places/:id", getPlaceById);

// Public curated lists
router.get("/hotels/famous", getFamousHotels);
router.get("/cities/trending", getTrendingCities);
router.get("/tips", getTravelTips);

export default router;
