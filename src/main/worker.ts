import type { Worker } from "bullmq";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../infrastructure/database/redis/redis.connection";
import type { NotificationWorkerFactory } from "../infrastructure/queue/workers";
import logger from "../shared/logging/logger";
import { TYPES } from "../shared/types/types";
import { notificationQueue } from "./di/queues.di";
import { workerContainer } from "./di/worker.container";
import { setupGracefulShutdown } from "./lifecyle/graceful-shutdown";

let notificationWorker: Worker;

async function start() {
	logger.info("Starting worker...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	notificationWorker = workerContainer
		.get<NotificationWorkerFactory>(TYPES.Workers.NotificationWorkerFactory)
		.create();
}

setupGracefulShutdown({
	name: "WORKER",
	tasks: [
		() => disconnectFromMongo(),
		() => notificationWorker?.close(),
		() => notificationQueue.close(),
		() => disconnectRedis(),
	],
});

start();
