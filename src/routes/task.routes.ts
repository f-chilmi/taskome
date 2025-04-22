import { Router } from "express";
import { task } from "../controllers";
import { isAuth } from "../middlewares";

const router = Router();

router.post("/", isAuth, task.createTask);
router.get("/", task.getTasks);
router.get("/:id", task.getTask);
router.put("/:id", isAuth, task.updateTask);
router.delete("/:id", isAuth, task.deleteTask);

export { router as taskRouter };
