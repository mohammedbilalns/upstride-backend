import App from "./app.js";
import env from "@infrastructure/config/env.js";
import logger from "@infrastructure/logging/logger.js";
import {
	disconnectRedis,
	redisClient,
} from "@/infrastructure/database/redis.connection.js";
import {
	connectToMongo,
	disconnectFromMongo,
} from "@/infrastructure/database/mongodb.connection.js";
("");

let isShuttingDown = false;
let appInstance: App;

async function bootStrap() {
	logger.info("Starting...");
	await Promise.all([connectToMongo(), redisClient.ping()]);
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
		await Promise.all([disconnectFromMongo(), disconnectRedis()]);
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

bootStrap();
