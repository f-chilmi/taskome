import asyncHandler from "express-async-handler";
import {
  PaginationService,
  projectService,
  redisService,
  taskService,
} from "../services";
import {
  BAD_REQUEST,
  CREATED,
  createProjectSchema,
  logger,
  OK,
} from "../utils";
import { IPaginationQuery } from "../types";
import { isValid } from "date-fns";

const PROJECT_CACHE_KEY = "projects";
const CACHE_EXPIRY_SECONDS = 60;

export const createProject = asyncHandler(async (req, res) => {
  const createProjectPayload = createProjectSchema.parse(req.body);

  const projectInfo = await projectService.createOne(createProjectPayload);

  console.log("projectInfo", projectInfo);
  logger.info(projectInfo);

  // Invalidate the cache
  await redisService.deleteByPrefix(PROJECT_CACHE_KEY); // Delete all projects cache
  logger.info("Projects cache invalidated due to project creation");

  res.status(CREATED).json({
    message: "Project created successfully",
    data: projectInfo,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };
  const createProjectPayload = createProjectSchema.parse(req.body);

  const projectInfo = await projectService.updateOne(id, createProjectPayload);

  console.log("projectInfo", projectInfo);
  logger.info(projectInfo);

  // Invalidate the cache
  await redisService.deleteByPrefix(PROJECT_CACHE_KEY); // Delete all projects cache
  logger.info("Projects cache invalidated due to project update");

  res.status(OK).json({
    message: "Project updated successfully",
    data: projectInfo,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };

  const project = await projectService.deleteOne(id);

  if (!project.deletedCount) {
    res.status(BAD_REQUEST).json({
      message: "Something went wrong",
    });
  }

  // Invalidate the cache
  await redisService.deleteByPrefix(PROJECT_CACHE_KEY);
  logger.info("Projects cache invalidated due to project deletion");
  res.status(OK).json({
    message: "Project deleted",
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    status,
  } = req.query as unknown as IPaginationQuery & {
    status?: string;
    dueDate?: string;
  };

  const cacheKey = `${PROJECT_CACHE_KEY}:${JSON.stringify(req.query)}`;
  console.log(cacheKey);

  // 1. Check if the result is in the cache
  const cachedProjects = await redisService.get<any>(cacheKey);
  if (cachedProjects) {
    logger.info("Projects retrieved from cache");
    res.status(OK).json({
      message: "Project list (cached)",
      data: cachedProjects.data,
      pagination: cachedProjects.pagination,
    });
    return;
  }

  const query: any = {};
  if (status) {
    query.status = status;
  }

  const { skip, take } = PaginationService.getPagination({
    pageNumber,
    pageSize,
  });

  // 2. If not in cache, fetch from the database
  const [projects, totalCount] = await Promise.all([
    projectService.findAll(query, skip, take),
    projectService.countAll(query),
  ]);

  const response = {
    message: "Project list",
    data: projects,
    totalCount,
  };

  // 3. Store the result in the cache
  await redisService.set(
    cacheKey,
    JSON.stringify(response),
    CACHE_EXPIRY_SECONDS
  );
  logger.info("Projects retrieved from database and stored in cache");

  res.status(OK).json(response);
});

export const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params as {
    id: string;
  };

  const project = await projectService.findById(id);
  const tasks = await taskService.findAll({ projectId: id });
  console.log(tasks);

  res.status(OK).json({
    message: "project detail",
    data: { project, tasks },
  });
});

// export const updateTask = asyncHandler(async (req, res) => {
//   const { id } = req.params as {
//     id: string;
//   };

//   const updateTaskPayload = updateTaskSchema.parse(req.body);

//   const task = await taskService.updateOne(id, updateTaskPayload);

//   if (!task.matchedCount) {
//     res.status(NOT_FOUND).json({
//       message: "Task not found",
//     });
//   }

//   if (!task.modifiedCount) {
//     res.status(BAD_REQUEST).json({
//       message: "Something went wrong",
//     });
//   }
//   // Invalidate the cache
//   await redisService.deleteByPrefix(TASKS_CACHE_KEY); // Delete all tasks cache
//   logger.info("Tasks cache invalidated due to task update");
//   res.status(OK).json({
//     message: "Task updated successfully",
//   });
// });

// export const deleteTask = asyncHandler(async (req, res) => {
//   const { id } = req.params as {
//     id: string;
//   };

//   const task = await taskService.deleteOne(id);

//   if (!task.deletedCount) {
//     res.status(BAD_REQUEST).json({
//       message: "Something went wrong",
//     });
//   }

//   // Invalidate the cache
//   await redisService.deleteByPrefix(TASKS_CACHE_KEY); // Delete all tasks cache
//   logger.info("Tasks cache invalidated due to task deletion");
//   res.status(OK).json({
//     message: "Task deleted",
//   });
// });
