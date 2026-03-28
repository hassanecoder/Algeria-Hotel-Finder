import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hotelsRouter from "./hotels";
import citiesRouter from "./cities";
import bookingsRouter from "./bookings";
import amenitiesRouter from "./amenities";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hotelsRouter);
router.use(citiesRouter);
router.use(bookingsRouter);
router.use(amenitiesRouter);

export default router;
