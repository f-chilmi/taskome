import { Router } from "express";
import { project } from "../controllers";
import { isAuth, isAdmin } from "../middlewares";

const router = Router();

router.post("/", isAuth, project.createProject);
router.get("/", project.getProjects);
router.get("/:id", project.getProject);
router.put("/:id", isAuth, project.updateProject);
router.delete("/:id", isAuth, project.deleteProject);

export { router as projectRouter };
