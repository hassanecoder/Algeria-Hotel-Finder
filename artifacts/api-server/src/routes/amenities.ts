import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { amenitiesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/amenities", async (req, res) => {
  try {
    const amenities = await db.select().from(amenitiesTable);
    res.json(amenities);
  } catch (err) {
    req.log.error({ err }, "Error fetching amenities");
    res.status(500).json({ error: "internal_error", message: "Failed to fetch amenities" });
  }
});

export default router;
