import { Queue } from "bullmq";
import type { Container } from "inversify";
import type { BookingJobQueuePort } from "../../application/ports/booking-job-queue.port";
import type { JobQueuePort } from "../../application/ports/job-queue.port";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import { InMemoryEventBus } from "../../infrastructure/events/in-memory-event-bus";
import { BookingJobQueueAdapter } from "../../infrastructure/queue/booking-job-queue.adapter";
import { JobQueueAdapter } from "../../infrastructure/queue/job-queue.adapter";
import { QUEUE_NAMES } from "../../shared/constants";
import { TYPES } from "../../shared/types/types";

/**
 * Notification queue for processing email and push notification jobs.
 */
export const notificationQueue = new Queue(QUEUE_NAMES.NOTIFICATION, {
	connection: redisClient,
});

export const bookingSettlementQueue = new Queue(
	QUEUE_NAMES.BOOKING_SETTLEMENT,
	{
		connection: redisClient,
	},
);

const inMemoryEventBus = new InMemoryEventBus();
export const appEventBus = inMemoryEventBus;

/**
 * Registers queue and event bus bindings to the Inversify container.
 */
export const registerQueueBindings = (container: Container): void => {
	container
		.bind<Queue>(TYPES.Queues.NotificationQueue)
		.toConstantValue(notificationQueue);
	container
		.bind<Queue>(TYPES.Queues.BookingSettlementQueue)
		.toConstantValue(bookingSettlementQueue);
	container.bind<JobQueuePort>(TYPES.Services.JobQueue).to(JobQueueAdapter);
	container
		.bind<BookingJobQueuePort>(TYPES.Services.BookingJobQueue)
		.to(BookingJobQueueAdapter);
	container.bind(TYPES.Services.EventBus).toConstantValue(appEventBus);
};
