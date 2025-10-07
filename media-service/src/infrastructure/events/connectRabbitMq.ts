import logger from "../../common/utils/logger";
import { loadConsumers } from "./consumerLoader";
import { initEventBus } from "./eventBus";

export async function connectRabbitMq() {
	await initEventBus();
	await loadConsumers();
	logger.info("RabbitMQ connected and consumers loaded");
}
