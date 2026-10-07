import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";
import { Place, PlaceType, AnalyticsData } from "../models/types";

export function getAnalytics(req: Request, res: Response) {
  const usersCount = db.users.length;
  const placesCount = db.places.length;
  const reviewsCount = db.reviews.length;
  const searchesCount = db.searchHistory.length;

  const placesByType: Record<PlaceType, number> = {
    hotel: 0,
    restaurant: 0,
    resort: 0,
    attraction: 0,
    cafe: 0,
    temple: 0
  };
  db.places.forEach((p) => {
    if (placesByType[p.type] !== undefined) {
      placesByType[p.type]++;
    }
  });

  const cityCounts: Record<string, number> = {};
  db.searchHistory.forEach((sh) => {
    cityCounts[sh.query] = (cityCounts[sh.query] || 0) + 1;
  });
  const popularCities = Object.entries(cityCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const analytics: AnalyticsData = {
    usersCount,
    placesCount,
    reviewsCount,
    searchesCount,
    placesByType,
    popularCities
  };

  res.json(analytics);
}

export function getAdminPlaces(req: Request, res: Response) {
  res.json(db.places);
}

export function createAdminPlace(req: Request, res: Response) {
  const newPlace: Place = {
    ...req.body,
    id: "p-" + Math.random().toString(36).substr(2, 9),
    rating: Number(req.body.rating || 4.5),
    reviewCount: 0,
    reviews: []
  };
  db.places.push(newPlace);
  saveDatabase(db);
  res.status(201).json(newPlace);
}

export function updateAdminPlace(req: Request, res: Response) {
  const { id } = req.params;
  const idx = db.places.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Place not found" });
  }

  db.places[idx] = {
    ...db.places[idx],
    ...req.body,
    id
  };
  saveDatabase(db);
  res.json(db.places[idx]);
}

export function deleteAdminPlace(req: Request, res: Response) {
  const { id } = req.params;
  db.places = db.places.filter((p) => p.id !== id);
  db.reviews = db.reviews.filter((r) => r.placeId !== id);
  saveDatabase(db);
  res.json({ success: true, message: "Place deleted successfully" });
}

export function getAdminUsers(req: Request, res: Response) {
  res.json(
    db.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      avatar: u.avatar
    }))
  );
}

export function deleteAdminUser(req: Request, res: Response) {
  const { id } = req.params;
  if (id === "admin-id") {
    return res.status(400).json({ error: "Cannot delete master administrator account" });
  }
  db.users = db.users.filter((u) => u.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: "User deleted successfully" });
}

export function getPendingReviews(req: Request, res: Response) {
  const pending = db.reviews.filter((r) => !r.approved);
  res.json(pending);
}

export function approveReview(req: Request, res: Response) {
  const { id } = req.params;
  const review = db.reviews.find((r) => r.id === id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  review.approved = true;

  const place = db.places.find((p) => p.id === review.placeId);
  if (place) {
    const placeReviews = db.reviews.filter((r) => r.placeId === review.placeId && r.approved);
    const avg = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;
    place.rating = parseFloat(avg.toFixed(1));
    place.reviewCount = placeReviews.length;
  }

  db.notifications.push({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: review.userId,
    text: `Your review for ${place ? place.name : "a place"} has been approved by the admin!`,
    type: "success",
    read: false,
    date: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, message: "Review approved successfully" });
}

export function deleteReview(req: Request, res: Response) {
  const { id } = req.params;
  const review = db.reviews.find((r) => r.id === id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  db.reviews = db.reviews.filter((r) => r.id !== id);

  const place = db.places.find((p) => p.id === review.placeId);
  if (place) {
    const placeReviews = db.reviews.filter((r) => r.placeId === review.placeId && r.approved);
    if (placeReviews.length > 0) {
      const avg = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;
      place.rating = parseFloat(avg.toFixed(1));
      place.reviewCount = placeReviews.length;
    } else {
      place.rating = 4.5;
      place.reviewCount = 0;
    }
  }

  saveDatabase(db);
  res.json({ success: true, message: "Review deleted successfully" });
}
