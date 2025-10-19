import type Redis from "ioredis";
import type { ICacheService } from "../../domain/services/cache.service.interface";

export class CacheService implements ICacheService {
	constructor(private client: Redis) {}

	async set<T>(key: string, value: T, ttl?: number) {
		const data = JSON.stringify(value);
		if (ttl) await this.client.setex(key, ttl, data);
		else await this.client.set(key, data);
	}

	async get<T>(key: string): Promise<T | null> {
		const data = await this.client.get(key);
		return data ? JSON.parse(data) : null;
	}

	async del(key: string) {
		await this.client.del(key);
	}

	async expire(key: string, ttl: number) {
		await this.client.expire(key, ttl);
	}
}
