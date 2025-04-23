import mongoose from "mongoose";

import { logger } from "../utils";
import { databaseUrl } from "../config";

const connectDB = async () => {
  try {
    const mongoURI = databaseUrl;
    if (!mongoURI) {
      logger.error("MONGO_URI environment variable not defined");

      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    logger.info("DB connected... 🧹" + mongoURI);
  } catch (error) {
    logger.error("MongoDB connection error:" + error);
    process.exit(1);
  }
};

export { connectDB };
