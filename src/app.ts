import express, { NextFunction, Request, Response } from "express";
import routes from "./routes";
import cors from "cors";
import { connectDB, corsConfig, nodeEnv } from "./config";
import { INTERNAL_SERVER_ERROR, logger, SERVER } from "./utils";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
const morganLogger =
  nodeEnv === SERVER.DEVELOPMENT
    ? morgan("dev")
    : morgan("combined", {
        skip: (_: any, res: { statusCode: number }) =>
          res.statusCode < INTERNAL_SERVER_ERROR,
      });

connectDB();

app.set("trust proxy", 1);
app.use(morganLogger);
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(compression());
app.use(cors(corsConfig));

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (_, res) => {
  res.send(
    '<div style="text-align: center; margin-top: 20px;"><h1>Welcome to Taskome API 🚀</h1></div>'
  );
});
app.use("/api/v1", routes);

app.listen(SERVER.DEFAULT_PORT_NUMBER, () => {
  logger.info(
    `Server is running on http://localhost:${SERVER.DEFAULT_PORT_NUMBER}`
  );
});
