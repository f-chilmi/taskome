import asyncHandler from "express-async-handler";
import { PaginationService, redisService, userService } from "../services";
import { logger, OK } from "../utils";
import { IPaginationQuery } from "../types";

const USER_CACHE_KEY = "users";
const CACHE_EXPIRY_SECONDS = 60;

export const getUsers = asyncHandler(async (req, res) => {
  const { pageNumber = 1, pageSize = 10 } =
    req.query as unknown as IPaginationQuery & {};

  const cacheKey = `${USER_CACHE_KEY}:${JSON.stringify(req.query)}`;
  console.log(cacheKey);

  // 1. Check if the result is in the cache
  const cachedUsers = await redisService.get<any>(cacheKey);
  if (cachedUsers) {
    logger.info("Users retrieved from cache");
    res.status(OK).json({
      message: "User list (cached)",
      data: cachedUsers.data,
      pagination: cachedUsers.pagination,
    });
    return;
  }

  const query: any = {};

  const { skip, take } = PaginationService.getPagination({
    pageNumber,
    pageSize,
  });

  // 2. If not in cache, fetch from the database
  const [users] = await Promise.all([userService.findAll(query, skip, take)]);

  const response = {
    message: "User list",
    data: users,
  };

  // 3. Store the result in the cache
  await redisService.set(
    cacheKey,
    JSON.stringify(response),
    CACHE_EXPIRY_SECONDS
  );
  logger.info("Users retrieved from database and stored in cache");

  res.status(OK).json(response);
});
