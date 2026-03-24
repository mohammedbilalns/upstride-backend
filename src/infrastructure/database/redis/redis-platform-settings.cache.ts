import { inject, injectable } from "inversify";
import type { Redis } from "ioredis";
import type { IPlatformSettingsCache } from "../../../application/services";
import type { PlatformSettingsDataMap } from "../../../shared/config/platform-settings.defaults";
import { TYPES } from "../../../shared/types/types";

const PLATFORM_SETTINGS_CACHE_KEY = "platform_settings:all";

@injectable()
export class RedisPlatformSettingsCache implements IPlatformSettingsCache {
	constructor(
		@inject(TYPES.Databases.Redis)
		private readonly _redis: Redis,
	) {}

	async get(): Promise<PlatformSettingsDataMap | null> {
		const cached = await this._redis.get(PLATFORM_SETTINGS_CACHE_KEY);

		if (!cached) {
			return null;
		}

		return JSON.parse(cached) as PlatformSettingsDataMap;
	}

	async set(settings: PlatformSettingsDataMap): Promise<void> {
		await this._redis.set(
			PLATFORM_SETTINGS_CACHE_KEY,
			JSON.stringify(settings),
		);
	}

	async clear(): Promise<void> {
		await this._redis.del(PLATFORM_SETTINGS_CACHE_KEY);
	}
}
