import { Router } from "express";
import { isAuth } from "../middlewares";
import { habit } from "../controllers";

const router = Router();

router.post("/", isAuth, habit.createHabit);
router.get("/", isAuth, habit.getHabits);
// router.get("/:id", task.getTask);
// router.put("/:id", isAuth, task.updateTask);
router.delete("/:id", isAuth, habit.deleteHabit);

export { router as habitRouter };
