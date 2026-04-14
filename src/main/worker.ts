import type { Worker } from "bullmq";
import type { IMailService } from "../application/services";
import type { IUserRepository } from "../domain/repositories/user.repository.interface";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../infrastructure/database/redis/redis.connection";
import { createMailWorker } from "../infrastructure/queue/workers/mail.worker";
import logger from "../shared/logging/logger";
import { TYPES } from "../shared/types/types";
import { mailQueue } from "./di/queues.di";
import { workerContainer } from "./di/worker.container";
import { setupGracefulShutdown } from "./lifecyle/graceful-shutdown";

let mailWorker: Worker;

async function start() {
	logger.info("Starting worker...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	const mailService = workerContainer.get<IMailService>(
		TYPES.Services.MailService,
	);
	const userRepository = workerContainer.get<IUserRepository>(
		TYPES.Repositories.UserRepository,
	);
	mailWorker = createMailWorker(redisClient, mailService, userRepository);
}

setupGracefulShutdown({
	name: "WORKER",
	tasks: [
		() => disconnectFromMongo(),
		() => mailWorker?.close(),
		() => mailQueue.close(),
		() => disconnectRedis(),
	],
});

start();
