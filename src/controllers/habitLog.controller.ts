import asyncHandler from "express-async-handler";
import { habitLogService } from "../services";
import { CREATED, createHabitLogSchema, logger } from "../utils";
import { Types } from "mongoose";

export const createHabitLog = asyncHandler(async (req, res) => {
  const payload = createHabitLogSchema.parse(req.body);

  const habitInfo = await habitLogService.updateOrCreateOne({
    ...payload,
    habitId: new Types.ObjectId(payload.habitId),
    userId: new Types.ObjectId(req.user?.id),
  });

  logger.info(habitInfo);

  res.status(CREATED).json({
    message: "Habit created successfully",
    data: habitInfo,
  });
});
