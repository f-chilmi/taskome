import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { userService } from "../services";
import { ApiError, FORBIDDEN, logger, UNAUTHORIZED } from "../utils";
import { RoleEnum } from "../types";

export const isAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return next(new ApiError("Unauthorized", UNAUTHORIZED));
    }

    const user = await userService.findUserById(req.user.id);

    if (!user) {
      return next(new ApiError("Unauthorized", UNAUTHORIZED));
    }

    if (user.role !== RoleEnum.ADMIN) {
      return next(new ApiError("Forbidden", FORBIDDEN));
    }

    next();
  }
);
