import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";

export function getUserProfile(req: Request, res: Response) {
  const userPayload = (req as any).user;
  const user = db.users.find((u) => u.id === userPayload.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const favPlaces = db.places.filter((p) => (user.favorites || []).includes(p.id));
  const history = db.searchHistory
    .filter((sh) => sh.userId === userPayload.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
  const userReviews = db.reviews.filter((r) => r.userId === userPayload.id);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      favorites: user.favorites || []
    },
    favorites: favPlaces,
    history,
    reviews: userReviews
  });
}

export function clearSearchHistory(req: Request, res: Response) {
  const userPayload = (req as any).user;
  db.searchHistory = db.searchHistory.filter((sh) => sh.userId !== userPayload.id);
  saveDatabase(db);
  res.json({ success: true });
}

export function updateUserProfile(req: Request, res: Response) {
  const { name, avatar } = req.body;
  const userPayload = (req as any).user;

  const user = db.users.find((u) => u.id === userPayload.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;

  saveDatabase(db);
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    avatar: user.avatar,
    favorites: user.favorites || []
  };
  res.json({ success: true, user: safeUser });
}

export function toggleFavorite(req: Request, res: Response) {
  const { placeId } = req.body;
  const userPayload = (req as any).user;

  if (!placeId) {
    return res.status(400).json({ error: "placeId is required" });
  }

  const user = db.users.find((u) => u.id === userPayload.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.favorites) {
    user.favorites = [];
  }

  const idx = user.favorites.indexOf(placeId);
  let action: "added" | "removed" = "added";
  if (idx > -1) {
    user.favorites.splice(idx, 1);
    action = "removed";
  } else {
    user.favorites.push(placeId);
    action = "added";
  }

  saveDatabase(db);
  res.json({ success: true, action, favorites: user.favorites });
}
