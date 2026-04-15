import type { Worker } from "bullmq";
import type {
	IMailService,
	IPushNotificationPort as PushNotificationPort,
} from "../application/services";
import type { IPushSubscriptionRepository } from "../domain/repositories/push-subscription.repository.interface";
import type { IUserRepository } from "../domain/repositories/user.repository.interface";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../infrastructure/database/redis/redis.connection";
import { createNotificationWorker } from "../infrastructure/queue/workers/notification.worker";
import logger from "../shared/logging/logger";
import { TYPES } from "../shared/types/types";
import { notificationQueue } from "./di/queues.di";
import { workerContainer } from "./di/worker.container";
import { setupGracefulShutdown } from "./lifecyle/graceful-shutdown";

let notificationWorker: Worker;

async function start() {
	logger.info("Starting worker...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	const mailService = workerContainer.get<IMailService>(
		TYPES.Services.MailService,
	);
	const pushNotificationPort = workerContainer.get<PushNotificationPort>(
		TYPES.Services.PushNotificationPort,
	);
	const userRepository = workerContainer.get<IUserRepository>(
		TYPES.Repositories.UserRepository,
	);
	const pushSubscriptionRepository =
		workerContainer.get<IPushSubscriptionRepository>(
			TYPES.Repositories.PushSubscriptionRepository,
		);

	notificationWorker = createNotificationWorker(
		redisClient,
		mailService,
		userRepository,
		pushNotificationPort,
		pushSubscriptionRepository,
	);
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
