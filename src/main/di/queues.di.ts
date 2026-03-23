import { Queue } from "bullmq";
import type { Container } from "inversify";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import {
	BullMQEventBus,
	DOMAIN_EVENTS_QUEUE,
} from "../../infrastructure/events/bullmq-event-bus";
import { TYPES } from "../../shared/types/types";

export const mailQueue = new Queue("mailQueue", { connection: redisClient });
export const domainEventsQueue = new Queue(DOMAIN_EVENTS_QUEUE, {
	connection: redisClient,
});

export const bullMQEventBus = new BullMQEventBus(domainEventsQueue);

export const registerQueueBindings = (container: Container): void => {
	container.bind<Queue>(TYPES.Queues.MailQueue).toConstantValue(mailQueue);
	container
		.bind<Queue>(TYPES.Queues.DomainEvents)
		.toConstantValue(domainEventsQueue);
	container.bind(TYPES.Services.EventBus).toConstantValue(bullMQEventBus);
};
