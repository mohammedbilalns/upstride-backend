import { Queue } from "bullmq";
import type { Container } from "inversify";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import {
	APP_EVENTS_QUEUE,
	BullMQEventBus,
} from "../../infrastructure/events/bullmq-event-bus";
import { TYPES } from "../../shared/types/types";

/**
 * Mail queue for processing email sending jobs.
 * Workers listen to this queue to handle email delivery tasks.
 */
export const mailQueue = new Queue("mailQueue", { connection: redisClient });

/**
 * Queue for application events
 * Enables async event processing and loose coupling between services.
 */
export const domainEventsQueue = new Queue(APP_EVENTS_QUEUE, {
	connection: redisClient,
});

export const bullMQEventBus = new BullMQEventBus(domainEventsQueue);

/**
 * Registers BullMQ queue and event bus bindings to the Inversify container.
 */
export const registerQueueBindings = (container: Container): void => {
	container.bind<Queue>(TYPES.Queues.MailQueue).toConstantValue(mailQueue);
	container
		.bind<Queue>(TYPES.Queues.DomainEvents)
		.toConstantValue(domainEventsQueue);
	container.bind(TYPES.Services.EventBus).toConstantValue(bullMQEventBus);
};
