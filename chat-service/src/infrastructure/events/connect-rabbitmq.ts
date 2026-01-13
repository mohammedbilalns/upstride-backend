import logger from "../../common/utils/logger";
import { loadConsumers } from "./consumerLoader";
import { disconnectEventBus, initEventBus } from "./eventBus";

export async function connectRabbitmq() {
	await initEventBus();
	await loadConsumers();
	logger.info("RabbitMQ connected and consumers loaded");
}

export async function disconnectRabbitmq() {
	await disconnectEventBus();
	logger.info("🧹 RabbitMQ disconnected");
}
