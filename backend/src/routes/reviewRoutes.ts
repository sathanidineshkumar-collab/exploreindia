import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { createReview } from "../controllers/reviewController";

const router = Router();

router.post("/", authenticateToken, createReview);

export default router;
