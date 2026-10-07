import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";

export function getBookings(req: Request, res: Response) {
  const userPayload = (req as any).user;
  db.bookings = db.bookings || [];
  const userBookings = db.bookings.filter((b: any) => b.userId === userPayload.id);
  res.json(userBookings);
}

export function createBooking(req: Request, res: Response) {
  const { placeId, date, dateOut, guests, time } = req.body;
  const userPayload = (req as any).user;

  if (!placeId || !date || !guests) {
    return res.status(400).json({ error: "Place ID, date, and guest count are required" });
  }

  const place = db.places.find((p) => p.id === placeId);
  if (!place) {
    return res.status(404).json({ error: "Tourist spot or hotel not found" });
  }

  db.bookings = db.bookings || [];
  const newBooking = {
    id: "b-" + Math.random().toString(36).substr(2, 9),
    userId: userPayload.id,
    placeId: place.id,
    placeName: place.name,
    placePhoto: place.photos?.[0] || "",
    city: place.city,
    date,
    dateOut: dateOut || "",
    guests,
    time: time || "",
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  saveDatabase(db);
  res.status(201).json(newBooking);
}

export function deleteBooking(req: Request, res: Response) {
  const { id } = req.params;
  const userPayload = (req as any).user;
  db.bookings = db.bookings || [];

  const bookingIdx = db.bookings.findIndex((b: any) => b.id === id && b.userId === userPayload.id);
  if (bookingIdx === -1) {
    return res.status(404).json({ error: "Booking reservation not found" });
  }

  db.bookings.splice(bookingIdx, 1);
  saveDatabase(db);
  res.json({ success: true });
}
