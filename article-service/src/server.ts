import App from "./app";
import env from "./infrastructure/config/env";
import logger from "./common/utils/logger";
import { disconnectFromDb } from "./infrastructure/config";
import { disconnectRabbitMq } from "./infrastructure/events/connectRabbitMq";

const PORT = env.PORT;
const app = new App();
const server = app.listen(PORT);


let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
	if (isShuttingDown) {
		return;
	}
	isShuttingDown = true;

	logger.info(`${signal} received, starting graceful shutdown...`);

	const forceExitTimeout = setTimeout(() => {
		logger.error("Graceful shutdown timeout, forcing exit");
		process.exit(1);
	}, 10000); 

	try {
		// Wait for server to close before disconnecting services
		await new Promise<void>((resolve, reject) => {
			server.close((err) => {
				if (err) {
					logger.error(`Error closing HTTP server: ${err}`);
					reject(err);
				} else {
					logger.info("HTTP server closed");
					resolve();
				}
			});
		});

		// disconnect from services
		await Promise.all([
			disconnectFromDb(),
			disconnectRabbitMq()
		]);
		
		logger.info("All services disconnected");
		logger.info("Graceful shutdown completed");
		
		clearTimeout(forceExitTimeout);
		process.exit(0);
	} catch (error) {
		logger.error("Error during graceful shutdown:", error);
		clearTimeout(forceExitTimeout);
		process.exit(1);
	}
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGHUP", () => gracefulShutdown("SIGHUP"));

process.on("uncaughtException", (error: Error) => {
	logger.error(`uncaughtException: ${error}`);
	gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
	logger.error(`unhandledRejection at: ${promise} reason: ${reason}`);
	gracefulShutdown("unhandledRejection");
});
