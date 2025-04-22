import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { JwtService } from "../services";
import { ApiError, UNAUTHORIZED } from "../utils";

export const isAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError("Unauthorized", UNAUTHORIZED));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new ApiError("Unauthorized", UNAUTHORIZED));
    }

    const decoded = JwtService.verify(token, "access");

    req.user = { id: decoded.id as string };
    next();
  }
);
