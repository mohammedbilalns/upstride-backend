import type { Worker } from "bullmq";
import type { PlatformSettingsService } from "../application/services";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../infrastructure/database/redis/redis.connection";
import { createDomainEventWorker } from "../infrastructure/events/domain-event.worker.js";
import { createMailWorker } from "../infrastructure/queue/workers/mail.worker.js";
import env from "../shared/config/env.js";
import logger from "../shared/logging/logger.js";
import { TYPES } from "../shared/types/types.js";
import App from "./app.js";
import { container } from "./container.js";
import {
	bootstrapEventHandlers,
	bullMQEventBus,
	domainEventsQueue,
	mailQueue,
} from "./di/index.js";

let isShuttingDown = false; // flag to prevent multiple shutdowns
let appInstance: App;
let mailWorker: Worker;
let domainEventWorker: Worker;

async function start() {
	logger.info("Starting...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	const platformSettingsService = container.get<PlatformSettingsService>(
		TYPES.Services.PlatformSettings,
	);
	await platformSettingsService.load();

	// Initialize event handlers
	bootstrapEventHandlers(container);

	//worker for mail processing
	mailWorker = createMailWorker(redisClient);
	domainEventWorker = createDomainEventWorker(redisClient, bullMQEventBus);

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
			domainEventWorker?.close(),
			mailQueue.close(),
			domainEventsQueue.close(),
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
