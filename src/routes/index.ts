import { Router } from "express";
import { OK } from "../utils";
import { authRouter } from "./auth.routes";
import { taskRouter } from "./task.routes";

const router = Router();

router.get("/health", (_req, res) => {
  const uptime = process.uptime();

  res.status(OK).json({
    message: `I'm healthy 🏋️‍♂️`,
    uptime: `${Math.floor(uptime / 60)} minutes`,
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRouter);
router.use("/tasks", taskRouter);

export default router;
