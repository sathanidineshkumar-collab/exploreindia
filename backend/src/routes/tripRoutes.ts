import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getTrips,
  createTrip,
  deleteTrip,
  addPlaceToTrip,
  removePlaceFromTrip,
  updateTripNotes
} from "../controllers/tripController";

const router = Router();

router.use(authenticateToken);

router.get("/", getTrips);
router.post("/", createTrip);
router.delete("/:id", deleteTrip);
router.post("/:id/add-place", addPlaceToTrip);
router.post("/:id/remove-place", removePlaceFromTrip);
router.post("/:id/update-notes", updateTripNotes);

export default router;
