import { Router } from "express";
import { auth } from "../controllers";
import { isAuth } from "../middlewares";

const router = Router();

router.post("/register", auth.localRegister);
router.post("/login", auth.localLogin);
router.post("/logout", isAuth, auth.logout);

export { router as authRouter };
