import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";
import { Review } from "../models/types";

export function createReview(req: Request, res: Response) {
  const { placeId, rating, text } = req.body;
  const userPayload = (req as any).user;

  if (!placeId || !rating || !text) {
    return res.status(400).json({ error: "placeId, rating, and review text are required" });
  }

  const user = db.users.find((u) => u.id === userPayload.id);
  const place = db.places.find((p) => p.id === placeId);

  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  const newReview: Review = {
    id: "r-" + Math.random().toString(36).substr(2, 9),
    placeId,
    userId: userPayload.id,
    userName: user ? user.name : userPayload.name,
    userAvatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    rating: Number(rating),
    text,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    approved: user?.role === "admin" ? true : false
  };

  db.reviews.push(newReview);

  // Recalculate place overall rating if immediately approved
  if (newReview.approved) {
    const placeReviews = db.reviews.filter((r) => r.placeId === placeId && r.approved);
    const avg = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;
    place.rating = parseFloat(avg.toFixed(1));
    place.reviewCount = placeReviews.length;
  }

  saveDatabase(db);

  res.status(201).json({
    review: newReview,
    message: newReview.approved
      ? "Review added successfully!"
      : "Review submitted! It will appear after admin approval."
  });
}
