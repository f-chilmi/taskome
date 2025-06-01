import { Router } from "express";
import { isAuth } from "../middlewares";
import { event } from "../controllers";

const router = Router();

router.post("/", isAuth, event.createEvent);
router.get("/", isAuth, event.getEvents);
router.get("/:date", isAuth, event.getEventByDate); // date in format 2025-05-12

export { router as eventRouter };
