import { Worker } from "bullmq";
import type { Redis } from "ioredis";
import logger from "../../shared/logging/logger";
import type { BullMQEventBus } from "./bullmq-event-bus";
import { DOMAIN_EVENTS_QUEUE } from "./bullmq-event-bus";

export const createDomainEventWorker = (
	connection: Redis,
	eventBus: BullMQEventBus,
): Worker => {
	const worker = new Worker(
		DOMAIN_EVENTS_QUEUE,
		async (job) => {
			const { eventName, payload } = job.data;
			const completedHandlers: string[] = job.data.completedHandlers ?? [];
			const handlers = eventBus.getHandlers(eventName);

			if (handlers.length === 0) {
				throw new Error(`No handlers registered for event: ${eventName}`);
			}

			const failures: Error[] = [];

			for (const [index, handler] of handlers.entries()) {
				const handlerKey = `${eventName}:${index}`;
				if (completedHandlers.includes(handlerKey)) continue;

				try {
					await handler(payload);
					completedHandlers.push(handlerKey);
					await job.updateData({
						...job.data,
						completedHandlers,
					});
				} catch (err) {
					logger.error(
						{ err, handlerKey },
						"Handler failed during domain event processing",
					);
					failures.push(err instanceof Error ? err : new Error(String(err)));
				}
			}

			if (failures.length > 0) {
				throw new Error(
					`${failures.length} handler(s) failed. First error: ${failures[0].message}`,
				);
			}
		},
		{
			connection,
			concurrency: 5,
		},
	);

	worker.on("failed", (job, err) => {
		if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
			logger.error(
				{
					jobId: job.id,
					eventName: job.data.eventName,
					error: err.message,
					payload: job.data.payload,
				},
				"Job permanently failed — manual intervention required",
			);
		} else {
			logger.warn(
				`Domain event job ${job?.id} (${job?.name}) failed and will be retried: ${err.message}`,
			);
		}
	});

	worker.on("completed", (job) => {
		logger.info(`Domain event job ${job.id} (${job.name}) completed`);
	});

	return worker;
};
