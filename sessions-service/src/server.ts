import { configDotenv } from "dotenv";
import env from "./infrastructure/config/env";
import App from "./app";
import logger from "./utils/logger";
import { disconnectFromDb } from "./infrastructure/config/connectDb";

configDotenv();
const PORT = env.PORT;
const app = new App();
const server = app.listen(PORT);

async function gracefulShutdown(signal: string) {
	logger.info(`${signal} received, starting graceful shutdown...`);

	server.close(() => {
		logger.info("HTTP server closed");
	});

	try {
		await disconnectFromDb();
		logger.info("Database disconnected");

		logger.info("Graceful shutdown completed");
		process.exit(0);
	} catch (error) {
		logger.error("Error during graceful shutdown:", error);
		process.exit(1);
	}
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error: Error) => {
	logger.error("Uncaught Exception:", error);
	gracefulShutdown("uncaughtException");
});

process.on(
	"unhandledRejection",
	(reason: unknown, promise: Promise<unknown>) => {
		logger.error("Unhandled Rejection at:", promise, "reason:", reason);
		gracefulShutdown("unhandledRejection");
	},
);
