import { createClient, RedisClientType } from "redis";
import { redisUrl } from "../config";
import { logger } from "../utils";
import { IDatabaseClient } from "../types";

export class RedisDatabaseClient implements IDatabaseClient {
  private static instance: RedisDatabaseClient;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({ url: redisUrl });
  }

  static getInstance(): RedisDatabaseClient {
    if (!RedisDatabaseClient.instance) {
      RedisDatabaseClient.instance = new RedisDatabaseClient();
    }

    return RedisDatabaseClient.instance;
  }

  getClient() {
    return this.client;
  }

  async connect(): Promise<void> {
    try {
      await this.getClient().connect();
      logger.info(`Redis connected successfully! ✅`);
    } catch (error) {
      logger.error(`Redis connection failed - ${error} ❌`);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.getClient().disconnect();
      logger.info(`Redis disconnected successfully! ❌`);
    } catch (error) {
      logger.error(`Redis disconnection failed - ${error} ❌`);
    }
  }
}

export const redisClient = RedisDatabaseClient.getInstance().getClient();
