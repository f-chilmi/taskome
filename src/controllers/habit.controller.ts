import asyncHandler from "express-async-handler";
import { habitLogService, habitService, PaginationService } from "../services";
import { BAD_REQUEST, CREATED, createHabitSchema, logger, OK } from "../utils";
import { Types } from "mongoose";
import { IPaginationQuery } from "../types";

export const createHabit = asyncHandler(async (req, res) => {
  const payload = createHabitSchema.parse(req.body);

  const habitInfo = await habitService.createOne({
    ...payload,
    startDate: payload.startDate ? new Date(payload.startDate) : undefined,
    endDate: payload.endDate ? new Date(payload.endDate) : undefined,
    userId: new Types.ObjectId(payload.userId ?? req.user?.id),
  });

  logger.info(habitInfo);

  res.status(CREATED).json({
    message: "Habit created successfully",
    data: habitInfo,
  });
});

export const getHabits = asyncHandler(async (req, res) => {
  const {
    pageNumber = 1,
    pageSize = 1000,
    date,
  } = req.query as unknown as IPaginationQuery & {
    date: string | Date;
  };

  const query: any = {
    userId: new Types.ObjectId(req.user?.id),
  };

  const { skip, take } = PaginationService.getPagination({
    pageNumber,
    pageSize,
  });

  const [habits, totalCount] = await Promise.all([
    habitService.aggregateAll(
      query,
      parseInt(skip.toString()),
      parseInt(take.toString()),
      date
    ),
    habitService.countAll(query),
  ]);

  const response = {
    message: "Habit list",
    data: habits,
    totalCount,
  };

  res.status(OK).json(response);
});
export const deleteHabit = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };

  const [habit, habitLog] = await Promise.all([
    habitService.deleteOne(id),
    habitLogService.delete({ habitId: id }),
  ]);

  if (!habit.acknowledged || !habit.acknowledged) {
    res.status(BAD_REQUEST).json({
      message: "Something went wrong",
    });
  }
  res.status(OK).json({ message: "Habit deleted" });
});
