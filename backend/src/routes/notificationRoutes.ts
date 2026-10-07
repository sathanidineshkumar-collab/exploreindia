import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getNotifications, markAllNotificationsRead } from "../controllers/notificationController";

const router = Router();

router.use(authenticateToken);

router.get("/", getNotifications);
router.post("/read-all", markAllNotificationsRead);

export default router;
