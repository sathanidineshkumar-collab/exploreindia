import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";

export function getTrips(req: Request, res: Response) {
  const userPayload = (req as any).user;
  db.trips = db.trips || [];
  const userTrips = db.trips.filter((t: any) => t.userId === userPayload.id);
  res.json(userTrips);
}

export function createTrip(req: Request, res: Response) {
  const { name, destination, days } = req.body;
  const userPayload = (req as any).user;

  if (!name || !destination || !days) {
    return res.status(400).json({ error: "Name, destination and days are required" });
  }

  db.trips = db.trips || [];
  const newTrip = {
    id: "t-" + Math.random().toString(36).substr(2, 9),
    userId: userPayload.id,
    name,
    destination,
    days: Number(days),
    itinerary: Array.from({ length: Number(days) }, (_, i) => ({ day: i + 1, places: [] as any[] })),
    notes: {} as Record<string, string>,
    createdAt: new Date().toISOString()
  };

  db.trips.push(newTrip);
  saveDatabase(db);
  res.status(201).json(newTrip);
}

export function deleteTrip(req: Request, res: Response) {
  const { id } = req.params;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];

  const tripIdx = db.trips.findIndex((t: any) => t.id === id && t.userId === userPayload.id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: "Trip not found" });
  }

  db.trips.splice(tripIdx, 1);
  saveDatabase(db);
  res.json({ success: true });
}

export function addPlaceToTrip(req: Request, res: Response) {
  const { id } = req.params;
  const { placeId, day } = req.body;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];

  const trip = db.trips.find((t: any) => t.id === id && t.userId === userPayload.id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }

  const place = db.places.find((p) => p.id === placeId);
  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  const dayNum = Number(day);
  const dayPlan = (trip as any).itinerary.find((dayIt: any) => dayIt.day === dayNum);
  if (!dayPlan) {
    return res.status(400).json({ error: "Invalid day selection" });
  }

  const alreadyAdded = dayPlan.places.some((p: any) => p.id === placeId);
  if (!alreadyAdded) {
    dayPlan.places.push({
      id: place.id,
      name: place.name,
      type: place.type,
      rating: place.rating,
      reviewCount: place.reviewCount,
      photos: place.photos,
      address: place.address,
      city: place.city,
      state: place.state,
      coordinates: place.coordinates
    });
    saveDatabase(db);
  }

  res.json(trip);
}

export function removePlaceFromTrip(req: Request, res: Response) {
  const { id } = req.params;
  const { placeId, day } = req.body;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];

  const trip = db.trips.find((t: any) => t.id === id && t.userId === userPayload.id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }

  const dayNum = Number(day);
  const dayPlan = (trip as any).itinerary.find((dayIt: any) => dayIt.day === dayNum);
  if (!dayPlan) {
    return res.status(400).json({ error: "Invalid day selection" });
  }

  dayPlan.places = dayPlan.places.filter((p: any) => p.id !== placeId);
  saveDatabase(db);
  res.json(trip);
}

export function updateTripNotes(req: Request, res: Response) {
  const { id } = req.params;
  const { day, note } = req.body;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];

  const trip = db.trips.find((t: any) => t.id === id && t.userId === userPayload.id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }

  (trip as any).notes = (trip as any).notes || {};
  (trip as any).notes[String(day)] = note;

  saveDatabase(db);
  res.json(trip);
}
