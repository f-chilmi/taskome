import app from "./app";
import { logger, SERVER } from "./utils";

app.listen(SERVER.DEFAULT_PORT_NUMBER, () => {
  logger.info(
    `Server is running on http://localhost:${SERVER.DEFAULT_PORT_NUMBER}`
  );
});
