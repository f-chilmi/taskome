import { Router } from "express";
import { isAuth } from "../middlewares";
import { habitLog } from "../controllers";

const router = Router();

router.post("/", isAuth, habitLog.createHabitLog);

export { router as habitLogRouter };
