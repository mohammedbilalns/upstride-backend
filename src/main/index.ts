import type { PlatformSettingsService } from "../application/services";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../infrastructure/database/redis/redis.connection";
import env from "../shared/config/env";
import logger from "../shared/logging/logger";
import { TYPES } from "../shared/types/types";
import App from "./app";
import { bootstrapEventHandlers, mailQueue } from "./di";
import { apiContainer } from "./di/api.container";
import { setupGracefulShutdown } from "./lifecyle/graceful-shutdown";

let appInstance: App;

async function start() {
	logger.info("Starting...");

	await Promise.all([connectToMongo(), redisClient.ping()]);

	const platformSettingsService = apiContainer.get<PlatformSettingsService>(
		TYPES.Services.PlatformSettings,
	);
	await platformSettingsService.load();

	// Initialize event handlers
	bootstrapEventHandlers(apiContainer);

	// initialize http server
	appInstance = new App();
	appInstance.listen(env.PORT);
}

setupGracefulShutdown({
	name: "API",
	tasks: [
		() => appInstance?.close(),
		() => disconnectFromMongo(),
		() => mailQueue.close(),
		() => disconnectRedis(),
	],
});

start();
