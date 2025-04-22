import env from "./env";

export const databaseUrl = env("MONGO_URI");
export const redisUrl = env("REDIS_URL");
export const redisHost = env("REDIS_HOST");
export const redisPort = env("REDIS_PORT");
