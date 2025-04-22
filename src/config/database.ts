import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      logger.error("MONGO_URI environment variable not defined");

      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    logger.info("DB connected... 🧹");
  } catch (error) {
    logger.error("MongoDB connection error:" + error);
    process.exit(1);
  }
};

export { connectDB };
