import { Redis } from "ioredis";
import env from "../../../shared/config/env";
import logger from "../../../shared/logging/logger";
/**
 * Redis client instance.
 */
export const redisClient = new Redis(env.REDIS_URI);

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) =>
	logger.error(`Redis connection error: ${err}`),
);

/**
 * Gracefully terminates the Redis connection.
 *
 * - quit() allows Redis to finish pending commands.
 * - Falls back to forceful `disconnect()` if graceful shutdown fails.
 */
export const disconnectRedis = async () => {
	if (!redisClient) return;
	try {
		await redisClient.quit();
		logger.info("Redis connection closed gracefully");
	} catch (error) {
		logger.error(`Error closing Redis connection: ${error}`);
		redisClient.disconnect();
	}
};
