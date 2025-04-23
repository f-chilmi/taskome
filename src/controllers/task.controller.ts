import asyncHandler from "express-async-handler";
import { PaginationService, redisService, taskService } from "../services";
import {
  BAD_REQUEST,
  CREATED,
  createTaskSchema,
  logger,
  NOT_FOUND,
  OK,
  updateTaskSchema,
} from "../utils";
import { Types } from "mongoose";
import { IPaginationQuery } from "../types";
import { isValid } from "date-fns";

const TASKS_CACHE_KEY = "tasks";
const CACHE_EXPIRY_SECONDS = 60;

export const createTask = asyncHandler(async (req, res) => {
  console.log(20);
  const createTaskPayload = createTaskSchema.parse(req.body);
  console.log(21);
  const taskInfo = await taskService.createOne({
    ...createTaskPayload,
    dueDate: createTaskPayload.dueDate
      ? new Date(createTaskPayload.dueDate)
      : undefined,
    assignedTo: new Types.ObjectId(
      createTaskPayload.assignedTo ?? req.user?.id // default assignee is myself
    ),
  });

  console.log("taskinfo", taskInfo);
  logger.info(taskInfo);

  // Invalidate the cache
  await redisService.deleteByPrefix(TASKS_CACHE_KEY); // Delete all tasks cache
  logger.info("Tasks cache invalidated due to task creation");

  res.status(CREATED).json({
    message: "Task created successfully",
    data: taskInfo,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    status,
    dueDate,
  } = req.query as unknown as IPaginationQuery & {
    status?: string;
    dueDate?: string;
  };

  const cacheKey = `${TASKS_CACHE_KEY}:${JSON.stringify(req.query)}`;
  console.log(cacheKey);

  // 1. Check if the result is in the cache
  const cachedTasks = await redisService.get<any>(cacheKey);
  if (cachedTasks) {
    logger.info("Tasks retrieved from cache");
    res.status(OK).json({
      message: "Task list (cached)",
      data: cachedTasks.data,
      pagination: cachedTasks.pagination,
    });
    return;
  }

  const query: any = {};
  if (status) {
    query.status = status;
  }
  if (dueDate) {
    const parsedDate = new Date(dueDate);

    if (isValid(parsedDate)) {
      const [year, month, date] = [
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
      ];

      const start = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, date, 23, 59, 59, 999));

      query.dueDate = {
        $gte: start,
        $lte: end,
      };
    } else {
      res.status(BAD_REQUEST).json({
        message:
          "Invalid date format for dueDate. Please use ISO 8601 format (e.g., YYYY-MM-DD).",
      });
      return;
    }
  }

  const { skip, take } = PaginationService.getPagination({
    pageNumber,
    pageSize,
  });

  // 2. If not in cache, fetch from the database
  const [tasks, totalCount] = await Promise.all([
    taskService.findAll(query, skip, take),
    taskService.countAll(query),
  ]);

  const response = {
    message: "Task list",
    data: tasks,
    totalCount,
  };

  // 3. Store the result in the cache
  await redisService.set(
    cacheKey,
    JSON.stringify(response),
    CACHE_EXPIRY_SECONDS
  );
  logger.info("Tasks retrieved from database and stored in cache");

  res.status(OK).json(response);
});

export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };

  const task = await taskService.findById(id);

  res.status(OK).json({
    message: "Task detail",
    data: task,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };

  const updateTaskPayload = updateTaskSchema.parse(req.body);

  const task = await taskService.updateOne(id, updateTaskPayload);

  if (!task.matchedCount) {
    res.status(NOT_FOUND).json({
      message: "Task not found",
    });
  }

  if (!task.modifiedCount) {
    res.status(BAD_REQUEST).json({
      message: "Something went wrong",
    });
  }
  // Invalidate the cache
  await redisService.deleteByPrefix(TASKS_CACHE_KEY); // Delete all tasks cache
  logger.info("Tasks cache invalidated due to task update");
  res.status(OK).json({
    message: "Task updated successfully",
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };

  const task = await taskService.deleteOne(id);

  if (!task.deletedCount) {
    res.status(BAD_REQUEST).json({
      message: "Something went wrong",
    });
  }

  // Invalidate the cache
  await redisService.deleteByPrefix(TASKS_CACHE_KEY); // Delete all tasks cache
  logger.info("Tasks cache invalidated due to task deletion");
  res.status(OK).json({
    message: "Task deleted",
  });
});
