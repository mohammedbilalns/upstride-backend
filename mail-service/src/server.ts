import logger from "./common/utils/logger";
import {
	connectRabbitmq,
	disconnectRabbitmq,
} from "./infrastructure/events/connect-rabbitmq";

let isShuttingDown = false;

async function bootstrap() {
	try {
		await connectRabbitmq();
		logger.info("✅ Mail service connected to RabbitMQ and ready");
	} catch (err) {
		logger.error("❌ Failed to start mail service:", err);
		process.exit(1);
	}
}

async function shutdown(signal: string) {
	if (isShuttingDown) {
		logger.warn(`Shutdown already in progress, ignoring ${signal}`);
		return;
	}
	isShuttingDown = true;

	logger.info(` Received ${signal}. Starting graceful shutdown...`);

	const forceExitTimeout = setTimeout(() => {
		logger.error("⏰ Graceful shutdown timeout, forcing exit");
		process.exit(1);
	}, 15000);

	try {
		await disconnectRabbitmq();
		logger.info("✅ Graceful shutdown complete.");

		clearTimeout(forceExitTimeout);
		process.exit(0);
	} catch (err) {
		logger.error("❌ Error during shutdown:", err);
		clearTimeout(forceExitTimeout);
		process.exit(1);
	}
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGHUP", () => shutdown("SIGHUP"));

process.on("uncaughtException", (err) => {
	logger.error(`❌ Uncaught Exception:${err}`);
	shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
	logger.error(`❌ Unhandled Rejection: ${reason}`);
	shutdown("unhandledRejection");
});

bootstrap();
