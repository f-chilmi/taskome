import asyncHandler from "express-async-handler";
import { authService } from "../services";
import { CREATED, loginSchema, OK, registerSchema } from "../utils";

export const localRegister = asyncHandler(async (req, res) => {
  try {
    const userRegistrationInfo = registerSchema.parse(req.body);
    const userInfo = await authService.register(userRegistrationInfo);

    res.status(CREATED).json({
      message: "Registered successfully",
      data: userInfo.data,
      tokens: userInfo.tokens,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

export const localLogin = asyncHandler(async (req, res) => {
  try {
    const userLoginInfo = loginSchema.parse(req.body);
    const userInfo = await authService.login(userLoginInfo);

    res.status(OK).json({
      message: "Logged in successfully",
      data: userInfo.data,
      tokens: userInfo.tokens,
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    return res.status(status).json({ message });
  }
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.user?.token as string;
  await authService.logout(token);

  res.status(OK).json({ message: "Logged out successfully" });
});
