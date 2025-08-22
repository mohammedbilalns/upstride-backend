import { createClient, RedisClientType } from "redis";
import env from "./env";
import logger from "../../common/utils/logger";
import { CacheService } from "../../application/services";

let cacheService: CacheService | null = null;

export async function connectRedis(): Promise<CacheService> {
  if (!cacheService) {
    const client: RedisClientType = createClient({ url: env.REDIS_URL });

    client.on("error", (err) => logger.error("Redis Client Error", err));

    await client.connect();
    logger.info("Redis connected");

    cacheService = new CacheService(client);
  }
  return cacheService;
}

export function getCacheService(): CacheService {
  if (!cacheService) {
    throw new Error("CacheService not initialized. Call connectRedis() first.");
  }
  return cacheService;
}

