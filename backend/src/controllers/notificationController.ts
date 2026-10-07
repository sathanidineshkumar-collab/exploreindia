import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";

export function getNotifications(req: Request, res: Response) {
  const userPayload = (req as any).user;
  const list = db.notifications.filter((n) => n.userId === userPayload.id);
  res.json(list);
}

export function markAllNotificationsRead(req: Request, res: Response) {
  const userPayload = (req as any).user;
  db.notifications.forEach((n) => {
    if (n.userId === userPayload.id) {
      n.read = true;
    }
  });
  saveDatabase(db);
  res.json({ success: true });
}
