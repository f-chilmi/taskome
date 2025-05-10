import { Router } from "express";
import { user } from "../controllers";

const router = Router();

router.get("/", user.getUsers);

export { router as userRouter };
