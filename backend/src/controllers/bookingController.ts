import { Request, Response } from "express";
import { db, saveDatabase } from "../config/db";

export function getBookings(req: Request, res: Response) {
  const userPayload = (req as any).user;
  db.bookings = db.bookings || [];
  const userBookings = db.bookings.filter((b: any) => b.userId === userPayload.id);
  res.json(userBookings);
}

export function createBooking(req: Request, res: Response) {
  const { placeId, date, dateOut, guests, time, roomType, totalPrice } = req.body;
  const userPayload = (req as any).user;

  if (!userPayload || !userPayload.id) {
    return res.status(401).json({ error: "Authentication required to make a booking" });
  }

  // 1. Required field checks
  if (!placeId || !date || guests === undefined || guests === null || guests === "") {
    return res.status(400).json({ error: "Place ID, booking date, and guest count are required" });
  }

  // 2. Validate booking date
  const checkInDate = new Date(date);
  if (isNaN(checkInDate.getTime())) {
    return res.status(400).json({ error: "Invalid booking date format. Use YYYY-MM-DD" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkInDate < today) {
    return res.status(400).json({ error: "Booking date cannot be in the past" });
  }

  // 3. Validate check-out date when provided (required for multi-day hotel/resort stays)
  if (dateOut) {
    const checkOutDate = new Date(dateOut);
    if (isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: "Invalid check-out date format. Use YYYY-MM-DD" });
    }
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }
  }

  // 4. Validate guest count
  const guestCount = typeof guests === "number"
    ? Math.floor(guests)
    : parseInt(String(guests).replace(/\D+/g, ""), 10);

  if (!guestCount || guestCount < 1 || guestCount > 20) {
    return res.status(400).json({ error: "Guest count must be a valid number between 1 and 20" });
  }

  // 5. Verify target place exists in database
  const place = db.places.find((p) => p.id === placeId);
  if (!place) {
    return res.status(404).json({ error: "Tourist spot or hotel not found" });
  }

  // 6. Check for duplicate or conflicting confirmed reservation for this user
  db.bookings = db.bookings || [];
  const isDuplicate = db.bookings.some(
    (b: any) =>
      b.userId === userPayload.id &&
      b.placeId === place.id &&
      b.date === date &&
      b.status === "confirmed"
  );

  if (isDuplicate) {
    return res.status(409).json({
      error: "You already have a confirmed reservation for this destination on this date"
    });
  }

  // 7. Calculate default room type and price if not explicitly supplied
  const defaultRoomType = roomType || (place.rooms?.[0]?.type || (place.type === "hotel" || place.type === "resort" ? "Deluxe Room" : "General Entry"));
  const defaultPrice = totalPrice || place.priceRange || (place.type === "hotel" || place.type === "resort" ? "₹4,500" : "₹500");

  const newBooking = {
    id: "b-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2, 6),
    userId: userPayload.id,
    placeId: place.id,
    placeName: place.name,
    placePhoto: place.photos?.[0] || "",
    placeType: place.type,
    city: place.city,
    date,
    dateOut: dateOut || date,
    checkIn: date,
    checkOut: dateOut || date,
    guests: guestCount,
    time: time || "",
    roomType: defaultRoomType,
    totalPrice: defaultPrice,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  try {
    db.bookings.push(newBooking);
    saveDatabase(db);
    return res.status(201).json(newBooking);
  } catch (error: any) {
    // If persistence fails, roll back the in-memory push
    const idx = db.bookings.indexOf(newBooking);
    if (idx !== -1) db.bookings.splice(idx, 1);
    console.error("Failed to persist booking:", error);
    return res.status(500).json({ error: "Failed to save booking to database storage" });
  }
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
