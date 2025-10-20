import logger from "../../utils/logger";
import { initEventBus } from "./eventBus";

export async function connectRabbitMq() {
	await initEventBus();
	logger.info("RabbitMQ connected and consumers loaded");
}

