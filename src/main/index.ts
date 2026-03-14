import type { Worker } from "bullmq";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../infrastructure/database/redis/redis.connection";
import { createMailWorker } from "../infrastructure/queue/workers/mail.worker.js";
import env from "../shared/config/env.js";
import logger from "../shared/logging/logger.js";
import App from "./app.js";
import { mailQueue } from "./container.js";

let isShuttingDown = false; // flag to prevent multiple shutdowns
let appInstance: App;
let mailWorker: Worker;

async function start() {
	logger.info("Starting...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	//worker for mail processing
	mailWorker = createMailWorker(redisClient);

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
