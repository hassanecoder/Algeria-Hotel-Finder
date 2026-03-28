import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, hotelsTable, roomsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function generateReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "ALG-";
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

function daysBetween(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = d2.getTime() - d1.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

router.post("/bookings", async (req, res) => {
  try {
    const {
      hotelId,
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      adults,
      children = 0,
      specialRequests,
    } = req.body;

    if (!hotelId || !roomId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !adults) {
      res.status(400).json({ error: "validation_error", message: "Missing required fields" });
      return;
    }

    const [hotel] = await db.select().from(hotelsTable).where(eq(hotelsTable.id, hotelId)).limit(1);
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId)).limit(1);

    if (!hotel) {
      res.status(404).json({ error: "not_found", message: "Hotel not found" });
      return;
    }
    if (!room) {
      res.status(404).json({ error: "not_found", message: "Room not found" });
      return;
    }

    const nights = daysBetween(checkIn, checkOut);
    const totalPrice = room.pricePerNight * nights;
    const reference = generateReference();

    const [booking] = await db.insert(bookingsTable).values({
      reference,
      hotelId,
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      adults: parseInt(adults),
      children: parseInt(children),
      specialRequests: specialRequests ?? null,
      totalPrice,
      currency: hotel.currency,
      status: "confirmed",
    }).returning();

    res.status(201).json({
      ...booking,
      hotelName: hotel.name,
      roomName: room.name,
    });
  } catch (err) {
    req.log.error({ err }, "Error creating booking");
    res.status(500).json({ error: "internal_error", message: "Failed to create booking" });
  }
});

router.get("/bookings/:reference", async (req, res) => {
  try {
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.reference, req.params.reference)).limit(1);
    if (!booking) {
      res.status(404).json({ error: "not_found", message: "Booking not found" });
      return;
    }

    const [hotel] = await db.select().from(hotelsTable).where(eq(hotelsTable.id, booking.hotelId)).limit(1);
    const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId)).limit(1);

    res.json({
      ...booking,
      hotelName: hotel?.name ?? "",
      roomName: room?.name ?? "",
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching booking");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch booking" });
  }
});

export default router;
