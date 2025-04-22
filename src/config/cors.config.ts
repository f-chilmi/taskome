import { CorsOptions } from "cors";
import { SERVER } from "../utils";

export const corsConfig: CorsOptions = {
  // origin: SERVER.LOCALHOST_URLS,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
