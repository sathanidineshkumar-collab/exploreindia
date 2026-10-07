import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getUserProfile,
  updateUserProfile,
  clearSearchHistory
} from "../controllers/userController";

const router = Router();

router.use(authenticateToken);

router.get("/profile", getUserProfile);
router.post("/profile/update", updateUserProfile);
router.post("/clear-history", clearSearchHistory);

export default router;
