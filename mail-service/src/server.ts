import { configDotenv } from "dotenv";
import logger from "./common/utils/logger";
import {
	connectRabbitMq,
	disconnectRabbitMq,
} from "./infrastructure/events/connectRabbitMq";

configDotenv();

async function bootstrap() {
	try {
		await connectRabbitMq();
		logger.info("✅ Mail service connected to RabbitMQ and ready");
	} catch (err) {
		logger.error("❌ Failed to start mail service:", err);
		process.exit(1);
	}
}

async function shutdown(signal: string) {
	logger.info(`🛑 Received ${signal}. Starting graceful shutdown...`);
	try {
		await disconnectRabbitMq();
		logger.info("✅ Graceful shutdown complete.");
		process.exit(0);
	} catch (err) {
		logger.error("❌ Error during shutdown:", err);
		process.exit(1);
	}
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGHUP", () => shutdown("SIGHUP"));

process.on("uncaughtException", (err) => {
	logger.error("❌ Uncaught Exception:", err);
	shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
	logger.error("❌ Unhandled Rejection:", reason);
	shutdown("unhandledRejection");
});

bootstrap();
