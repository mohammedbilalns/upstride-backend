import { Queue } from "bullmq";
import type { Container } from "inversify";
import type { JobQueuePort } from "../../application/ports/job-queue.port";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import { InMemoryEventBus } from "../../infrastructure/events/in-memory-event-bus";
import { JobQueueAdapter } from "../../infrastructure/queue/job-queue.adapter";
import { TYPES } from "../../shared/types/types";

/**
 * Notification queue for processing email and push notification jobs.
 * Workers listen to this queue to handle delivery tasks.
 */
export const notificationQueue = new Queue("notificationQueue", {
	connection: redisClient,
});

const inMemoryEventBus = new InMemoryEventBus();
export const appEventBus = inMemoryEventBus;

/**
 * Registers queue and event bus bindings to the Inversify container.
 */
export const registerQueueBindings = (container: Container): void => {
	container
		.bind<Queue>(TYPES.Queues.NotificationQueue)
		.toConstantValue(notificationQueue);
	container.bind<JobQueuePort>(TYPES.Services.JobQueue).to(JobQueueAdapter);
	container.bind(TYPES.Services.EventBus).toConstantValue(appEventBus);
};
