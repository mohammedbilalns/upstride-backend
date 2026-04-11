import type { Worker } from "bullmq";
import type { IMailService } from "../application/services";
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
import { mailQueue } from "./di";
import { workerContainer } from "./worker.container";

let isShuttingDown = false;
let mailWorker: Worker;

async function start() {
	logger.info("Starting worker...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	const mailService = workerContainer.get<IMailService>(
		TYPES.Services.MailService,
	);
	mailWorker = createMailWorker(redisClient, mailService);
}

async function shutdown(signal: string) {
	if (isShuttingDown) return;

	isShuttingDown = true;
	logger.info(`Received ${signal}, shutting down worker...`);

	const forceExitTimeout = setTimeout(() => {
		logger.error("Force exiting worker...");
		process.exit(1);
	}, 10000);

	try {
		await Promise.allSettled([
			disconnectFromMongo(),
			mailWorker?.close(),
			mailQueue.close(),
			disconnectRedis(),
		]);
		clearTimeout(forceExitTimeout);
	} catch (error) {
		clearTimeout(forceExitTimeout);
		logger.error(`Error shutting down worker: ${error}`);
		process.exit(1);
	}
}

["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
	process.on(signal, shutdown);
});

process.on("uncaughtException", (error: Error) => {
	logger.error(`Caught exception: ${error}`);
	shutdown("uncaughtException");
});

process.on(
	"unhandledRejection",
	(reason: unknown, promise: Promise<unknown>) => {
		logger.error(
			`Caught unhandled rejection at: ${promise}, with reason: ${reason}`,
		);
		shutdown("unhandledRejection");
	},
);

start();
