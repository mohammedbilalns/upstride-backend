import logger from "../../shared/logging/logger";

type ShutdownTask = () => void | Promise<void>;
export function setupGracefulShutdown(options: {
	name: string;
	tasks: ShutdownTask[];
	timeoutMs?: number;
}) {
	let isShuttingDown = false;

	async function shutdown(signal: string) {
		if (isShuttingDown) return;
		isShuttingDown = true;

		logger.info(`[${options.name}] Received ${signal}, shutting down...`);

		const forceExitTimeout = setTimeout(() => {
			logger.error(`[${options.name}] Force exiting...`);
			process.exit(1);
		}, options.timeoutMs ?? 10000);

		try {
			await Promise.allSettled(options.tasks.map((task) => task()));
			clearTimeout(forceExitTimeout);
		} catch (error) {
			clearTimeout(forceExitTimeout);
			logger.error(`[${options.name}] Shutdown error: ${error}`);
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

	process.on("unhandledRejection", (reason) => {
		logger.error(`Unhandled rejection: ${reason}`);
		shutdown("unhandledRejection");
	});
}
