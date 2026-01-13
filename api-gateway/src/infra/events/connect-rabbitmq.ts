import logger from "../../utils/logger";
import { initEventBus } from "./event-bus";

export async function connectRabbitmq() {
	await initEventBus();
	logger.info("RabbitMQ connected and consumers loaded");
}
