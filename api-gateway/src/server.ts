import App from "./app";
import env from "./infra/config/env";
import EventBus from "./infra/events/eventBus";
import { initSocket } from "./interfaces/ws/socket.gateway";
import logger from "./utils/logger";

const PORT = env.PORT;
const serverInstance = new App();

/**
 * Bootstraps the Gateway service.
 *
 * - Initialize the event bus connection
 * - Initialize WebSocket Gateway
 * - Start the HTTP server
 *
 */
async function bootstrap() {
	await EventBus.init(env.RABBITMQ_URL);
	initSocket(serverInstance.server, EventBus);
	serverInstance.listen(PORT);
}

/**
 * Start the bootstrap process and
 * capture/handle any startup failures.
 */
bootstrap().catch((err) => {
	logger.error("Failed to bootstrap Gateway", err);
	process.exit(1);
});
