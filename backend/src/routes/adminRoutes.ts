import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import {
  getAnalytics,
  getAdminPlaces,
  createAdminPlace,
  updateAdminPlace,
  deleteAdminPlace,
  getAdminUsers,
  deleteAdminUser,
  getPendingReviews,
  approveReview,
  deleteReview
} from "../controllers/adminController";

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

// Analytics
router.get("/analytics", getAnalytics);

// Places CRUD
router.get("/places", getAdminPlaces);
router.post("/places", createAdminPlace);
router.put("/places/:id", updateAdminPlace);
router.delete("/places/:id", deleteAdminPlace);

// Users CRUD
router.get("/users", getAdminUsers);
router.delete("/users/:id", deleteAdminUser);

// Reviews moderation
router.get("/reviews/pending", getPendingReviews);
router.post("/reviews/approve/:id", approveReview);
router.delete("/reviews/:id", deleteReview);

export default router;
