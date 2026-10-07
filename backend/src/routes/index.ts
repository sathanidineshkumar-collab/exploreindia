import { Router } from "express";
import authRoutes from "./authRoutes";
import placeRoutes from "./placeRoutes";
import userRoutes from "./userRoutes";
import tripRoutes from "./tripRoutes";
import bookingRoutes from "./bookingRoutes";
import reviewRoutes from "./reviewRoutes";
import notificationRoutes from "./notificationRoutes";
import adminRoutes from "./adminRoutes";
import { authenticateToken } from "../middleware/auth";
import { toggleFavorite } from "../controllers/userController";

const router = Router();

// Authentication
router.use("/auth", authRoutes);

// User & Profile
router.use("/user", userRoutes);

// Favorites
router.post("/favorites/toggle", authenticateToken, toggleFavorite);

// Reviews
router.use("/reviews", reviewRoutes);

// Notifications
router.use("/notifications", notificationRoutes);

// Trips & Itineraries
router.use("/trips", tripRoutes);

// Bookings & Reservations
router.use("/bookings", bookingRoutes);

// Admin Dashboard & Moderation
router.use("/admin", adminRoutes);

// Places, Discovery, and Curated Lists
router.use("/", placeRoutes);

export default router;
