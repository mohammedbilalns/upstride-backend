import Redis from "ioredis";
import logger from "../../common/utils/logger";
import env from "./env";

export const redisClient = new Redis(env.REDIS_URL);

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) => logger.error(`Redis error: ${err}`));
