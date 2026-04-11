import type { Worker } from "bullmq";
import type {
	IMailService,
	PlatformSettingsService,
} from "../application/services";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../infrastructure/database/redis/redis.connection";
import { createMailWorker } from "../infrastructure/queue/workers/mail.worker";
import env from "../shared/config/env";
import logger from "../shared/logging/logger";
import { TYPES } from "../shared/types/types";
import App from "./app";
import { container } from "./container";
import { bootstrapEventHandlers, mailQueue } from "./di";

let isShuttingDown = false; // flag to prevent multiple shutdowns
let appInstance: App;
let mailWorker: Worker;

async function start() {
	logger.info("Starting...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	const platformSettingsService = container.get<PlatformSettingsService>(
		TYPES.Services.PlatformSettings,
	);
	await platformSettingsService.load();

	// Initialize event handlers
	bootstrapEventHandlers(container);

	//workers for background jobs
	const mailService = container.get<IMailService>(TYPES.Services.MailService);
	mailWorker = createMailWorker(redisClient, mailService);

	// initialize http server
	appInstance = new App();
	appInstance.listen(env.PORT);
}

async function shutdown(signal: string) {
	if (isShuttingDown) return;

	isShuttingDown = true;
	logger.info(`Received ${signal}, shutting down...`);

	const forceExitTimeout = setTimeout(() => {
		logger.error(`Force exiting...`);
		process.exit(1);
	}, 10000);

	try {
		if (appInstance) await appInstance.close();
		await Promise.allSettled([
			disconnectFromMongo(),
			mailWorker?.close(),
			mailQueue.close(),
			disconnectRedis(),
		]);
		clearTimeout(forceExitTimeout);
	} catch (error) {
		clearTimeout(forceExitTimeout);
		logger.error(`Error shutting down: ${error}`);
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
