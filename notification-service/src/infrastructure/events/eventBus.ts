import env from "../config/env";
import { RabbitMQEventBus } from "./rabbitmq";

const eventBus = new RabbitMQEventBus();

export async function initEventBus() {
	await eventBus.init(env.RABBITMQ_URL);
	return eventBus;
}

export default eventBus;
