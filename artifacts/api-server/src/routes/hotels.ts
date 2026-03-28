import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { hotelsTable, citiesTable, roomsTable, reviewsTable } from "@workspace/db/schema";
import { eq, and, gte, lte, like, or, desc, asc, inArray, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/hotels/featured", async (req, res) => {
  try {
    const hotels = await db.select().from(hotelsTable).where(eq(hotelsTable.isFeatured, true)).limit(6);
    const cities = await db.select().from(citiesTable);
    const cityMap = new Map(cities.map((c) => [c.id, c]));

    const result = hotels.map((h) => {
      const city = cityMap.get(h.cityId);
      return {
        ...h,
        city: city?.name ?? "",
        citySlug: city?.slug ?? "",
      };
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error fetching featured hotels");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch featured hotels" });
  }
});

router.get("/hotels", async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      stars,
      search,
      page = "1",
      limit = "12",
      sortBy,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (city) {
      const cityRecord = await db.select().from(citiesTable).where(eq(citiesTable.slug, city)).limit(1);
      if (cityRecord.length > 0) {
        conditions.push(eq(hotelsTable.cityId, cityRecord[0].id));
      }
    }

    if (minPrice) conditions.push(gte(hotelsTable.pricePerNight, parseFloat(minPrice)));
    if (maxPrice) conditions.push(lte(hotelsTable.pricePerNight, parseFloat(maxPrice)));
    if (stars) conditions.push(eq(hotelsTable.stars, parseInt(stars)));

    if (search) {
      conditions.push(
        or(
          like(hotelsTable.name, `%${search}%`),
          like(hotelsTable.description, `%${search}%`),
          like(hotelsTable.address, `%${search}%`)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sortBy) {
      case "price_asc":
        orderBy = asc(hotelsTable.pricePerNight);
        break;
      case "price_desc":
        orderBy = desc(hotelsTable.pricePerNight);
        break;
      case "rating_desc":
        orderBy = desc(hotelsTable.rating);
        break;
      case "name_asc":
        orderBy = asc(hotelsTable.name);
        break;
      default:
        orderBy = desc(hotelsTable.isFeatured);
    }

    const [hotelsResult, countResult] = await Promise.all([
      db.select().from(hotelsTable).where(where).orderBy(orderBy).limit(limitNum).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(hotelsTable).where(where),
    ]);

    const cities = await db.select().from(citiesTable);
    const cityMap = new Map(cities.map((c) => [c.id, c]));

    const hotels = hotelsResult.map((h) => {
      const cityRec = cityMap.get(h.cityId);
      return {
        ...h,
        city: cityRec?.name ?? "",
        citySlug: cityRec?.slug ?? "",
      };
    });

    const total = Number(countResult[0]?.count ?? 0);

    res.json({
      hotels,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching hotels");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch hotels" });
  }
});

router.get("/hotels/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(404).json({ error: "not_found", message: "Hotel not found" });
      return;
    }

    const [hotel] = await db.select().from(hotelsTable).where(eq(hotelsTable.id, id)).limit(1);
    if (!hotel) {
      res.status(404).json({ error: "not_found", message: "Hotel not found" });
      return;
    }

    const [city] = await db.select().from(citiesTable).where(eq(citiesTable.id, hotel.cityId)).limit(1);
    const rooms = await db.select().from(roomsTable).where(eq(roomsTable.hotelId, id));
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.hotelId, id)).orderBy(desc(reviewsTable.createdAt)).limit(10);

    res.json({
      ...hotel,
      city: city?.name ?? "",
      citySlug: city?.slug ?? "",
      rooms,
      reviews,
      nearbyAttractions: hotel.nearbyAttractions ?? [],
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      policies: hotel.policies ?? "",
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching hotel");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch hotel" });
  }
});

router.get("/hotels/:hotelId/reviews", async (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.hotelId, hotelId)).orderBy(desc(reviewsTable.createdAt));
    res.json(reviews);
  } catch (err) {
    req.log.error({ err }, "Error fetching reviews");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch reviews" });
  }
});

router.post("/hotels/:hotelId/reviews", async (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const { guestName, guestCountry, rating, title, comment } = req.body;

    if (!guestName || !guestCountry || !rating || !comment) {
      res.status(400).json({ error: "validation_error", message: "Missing required fields" });
      return;
    }

    const [review] = await db.insert(reviewsTable).values({
      hotelId,
      guestName,
      guestCountry,
      rating: parseFloat(rating),
      title: title ?? null,
      comment,
      date: new Date().toISOString().split("T")[0],
    }).returning();

    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.hotelId, hotelId));
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await db.update(hotelsTable)
      .set({ rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length })
      .where(eq(hotelsTable.id, hotelId));

    res.status(201).json(review);
  } catch (err) {
    req.log.error({ err }, "Error creating review");
    res.status(500).json({ error: "internal_error", message: "Failed to create review" });
  }
});

export default router;
