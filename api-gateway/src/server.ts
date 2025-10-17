import { configDotenv } from "dotenv";
import App from "./app";
import env from "./infra/config/env";
import { initSocket } from "./interfaces/ws/socket.gateway";
import EventBus from "./infra/events/eventBus";
import logger from "./utils/logger";

configDotenv();

const PORT = env.PORT;
const serverInstance = new App();

async function bootstrap() {
  await EventBus.init(env.RABBITMQ_URL);

  initSocket(serverInstance.server);

  serverInstance.listen(PORT);
}

bootstrap().catch((err) => {
	logger.error("Failed to bootstrap Gateway", err);
  process.exit(1);
});

