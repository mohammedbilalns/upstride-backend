import { Redis } from "ioredis";
import logger from "@infrastructure/logging/logger.js";
import env from "@infrastructure/config/env.js";

export const redisClient = new Redis(env.REDIS_URI);

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) =>
	logger.error(`Redis connection error: ${err}`),
);

export const disconnectFromRedis = async () => {
	if (!redisClient) return;
};

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
