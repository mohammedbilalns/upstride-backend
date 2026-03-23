import { inject, injectable } from "inversify";
import { PlatformSettingsService } from "../../application/services/platform-settings.service";
import type { IPlatformSettingsCache } from "../../application/services/platform-settings-cache.interface";
import type {
	PlatformSetting,
	PlatformSettingsType,
} from "../../domain/entities/platform-settings.entity";
import type { IPlatformSettingsRepository } from "../../domain/repositories/platform-settings.repository.interface";
import {
	DEFAULT_PLATFORM_SETTINGS,
	type PlatformSettingsDataMap,
} from "../../shared/config/platform-settings.defaults";
import { TYPES } from "../../shared/types/types";

const getRequiredSetting = (
	settings: PlatformSetting[],
	type: PlatformSettingsType,
) => {
	const setting = settings.find((item) => item.type === type);

	if (!setting) {
		throw new Error(`Missing required platform setting: ${type}`);
	}

	return setting;
};

const buildSettingsCacheMap = (
	settings: PlatformSetting[],
): PlatformSettingsDataMap => ({
	economy: getRequiredSetting(settings, "economy")
		.data as PlatformSettingsDataMap["economy"],
	mentors: getRequiredSetting(settings, "mentors")
		.data as PlatformSettingsDataMap["mentors"],
	content: getRequiredSetting(settings, "content")
		.data as PlatformSettingsDataMap["content"],
	sessions: getRequiredSetting(settings, "sessions")
		.data as PlatformSettingsDataMap["sessions"],
});

@injectable()
export class CachedPlatformSettingsService extends PlatformSettingsService {
	private _config: PlatformSettingsDataMap | null = null;

	constructor(
		@inject(TYPES.Repositories.PlatformSettingsRepository)
		private readonly _repository: IPlatformSettingsRepository,
		@inject(TYPES.Caches.PlatformSettings)
		private readonly _cache: IPlatformSettingsCache,
	) {
		super();
	}

	async load(forceRefresh = false): Promise<void> {
		if (this._config && !forceRefresh) {
			return;
		}

		if (!forceRefresh) {
			const cached = await this._cache.get();

			if (cached) {
				this._config = cached;
				return;
			}
		}

		const settings = await this._repository.ensureDefaults(
			DEFAULT_PLATFORM_SETTINGS,
		);
		const config = buildSettingsCacheMap(settings);

		await this._cache.set(config);
		this._config = config;
	}

	// Force a repository reload and replace the cached in-memory.
	async refresh(): Promise<void> {
		await this.load(true);
	}

	// Clear both process memory and Redis .
	async invalidate(): Promise<void> {
		this._config = null;
		await this._cache.clear();
	}

	get economy() {
		return this._getConfig().economy;
	}

	get mentors() {
		return this._getConfig().mentors;
	}

	get sessions() {
		return this._getConfig().sessions;
	}

	get content() {
		return this._getConfig().content;
	}

	getAll(): PlatformSettingsDataMap {
		return this._getConfig();
	}

	private _getConfig(): PlatformSettingsDataMap {
		if (!this._config) {
			throw new Error("Platform settings not loaded");
		}

		return this._config;
	}
}
