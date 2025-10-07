import env from "../config/env";
import { RabbitMQEventBus } from "./rabbitMq";

const EventBus = new RabbitMQEventBus();

export async function initEventBus() {
	await EventBus.init(env.RABBITMQ_URL);
	return EventBus;
}

export default EventBus;
