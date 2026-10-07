import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getBookings, createBooking, deleteBooking } from "../controllers/bookingController";

const router = Router();

router.use(authenticateToken);

router.get("/", getBookings);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

export default router;
