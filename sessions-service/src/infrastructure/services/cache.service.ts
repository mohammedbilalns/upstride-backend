import { ICacheService } from "../../domain/services/cache.service.interface";
import { redisClient } from "../config/connect-redis";

export class RedisCacheService implements ICacheService {
	async get<T>(key: string): Promise<T | null> {
		const data = await redisClient.get(key);
		return data ? JSON.parse(data) : null;
	}

	async set(key: string, value: any, ttl?: number): Promise<void> {
		const stringValue = JSON.stringify(value);
		if (ttl) {
			await redisClient.setex(key, ttl, stringValue);
		} else {
			await redisClient.set(key, stringValue);
		}
	}

	async del(key: string): Promise<void> {
		await redisClient.del(key);
	}
}
