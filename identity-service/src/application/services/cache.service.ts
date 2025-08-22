import { ICacheService } from "../../domain/services/cache.service.interface";
import { RedisClientType } from "redis";
import logger from "../../common/utils/logger";

export class CacheService implements ICacheService {

  constructor(private _client: RedisClientType) {}

  async connect(): Promise<void> {
    if (!this._client.isOpen) {
      await this._client.connect();
      logger.info("Redis connected")
    }
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    if (expirySeconds) {
      await this._client.setEx(key, expirySeconds, value);
    } else {
      await this._client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this._client.get(key);
	}

	async del(key: string): Promise<void> {
		await this._client.del(key);
	}


	async incr(key: string): Promise<number> {
		return await this._client.incr(key);
	}

	async expire(key: string, seconds: number): Promise<void> {
		await this._client.expire(key, seconds);
	}

}
