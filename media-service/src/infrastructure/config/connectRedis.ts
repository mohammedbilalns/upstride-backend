
import Redis from "ioredis";
import env from "./env";
import logger from "../../common/utils/logger";

export const redisClient = new Redis(env.REDIS_URL);

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) => logger.error("Redis Client Error", err));
