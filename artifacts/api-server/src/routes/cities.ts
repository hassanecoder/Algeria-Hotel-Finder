import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { citiesTable, hotelsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cities", async (req, res) => {
  try {
    const cities = await db.select().from(citiesTable);
    const hotelCounts = await db
      .select({
        cityId: hotelsTable.cityId,
        count: sql<number>`count(*)`,
      })
      .from(hotelsTable)
      .groupBy(hotelsTable.cityId);

    const countMap = new Map(hotelCounts.map((h) => [h.cityId, Number(h.count)]));

    const result = cities.map((c) => ({
      ...c,
      hotelCount: countMap.get(c.id) ?? 0,
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error fetching cities");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch cities" });
  }
});

router.get("/cities/:slug", async (req, res) => {
  try {
    const [city] = await db.select().from(citiesTable).where(eq(citiesTable.slug, req.params.slug)).limit(1);
    if (!city) {
      res.status(404).json({ error: "not_found", message: "City not found" });
      return;
    }

    const hotels = await db.select().from(hotelsTable).where(eq(hotelsTable.cityId, city.id));
    const hotelsWithCity = hotels.map((h) => ({
      ...h,
      city: city.name,
      citySlug: city.slug,
    }));

    res.json({
      ...city,
      hotelCount: hotels.length,
      hotels: hotelsWithCity,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching city");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch city" });
  }
});

export default router;
