import { inject, injectable } from "inversify";
import type {
	PlatformSetting,
	PlatformSettingsDataMap,
	PlatformSettingsType,
} from "../../domain/entities/platform-settings.entity";
import { DEFAULT_PLATFORM_SETTINGS } from "../../domain/entities/platform-settings.entity";
import type { IPlatformSettingsRepository } from "../../domain/repositories/platform-settings.repository.interface";
import { TYPES } from "../../shared/types/types";
import type { IPlatformSettingsCache } from "./platform-settings-cache.interface";

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
export class PlatformSettingsService {
	private config: PlatformSettingsDataMap | null = null;

	constructor(
		@inject(TYPES.Repositories.PlatformSettingsRepository)
		private readonly repository: IPlatformSettingsRepository,
		@inject(TYPES.Caches.PlatformSettings)
		private readonly cache: IPlatformSettingsCache,
	) {}

	async load(forceRefresh = false): Promise<void> {
		if (this.config && !forceRefresh) {
			return;
		}

		if (!forceRefresh) {
			const cached = await this.cache.get();

			if (cached) {
				this.config = cached;
				return;
			}
		}

		const settings = await this.repository.ensureDefaults(
			DEFAULT_PLATFORM_SETTINGS,
		);
		const config = buildSettingsCacheMap(settings);

		await this.cache.set(config);
		this.config = config;
	}

	// Force a repository reload and replace the cached in-memory.
	async refresh(): Promise<void> {
		await this.load(true);
	}

	// Clear both process memory and Redis .
	async invalidate(): Promise<void> {
		this.config = null;
		await this.cache.clear();
	}

	get economy() {
		return this.getConfig().economy;
	}

	get mentors() {
		return this.getConfig().mentors;
	}

	get sessions() {
		return this.getConfig().sessions;
	}

	get content() {
		return this.getConfig().content;
	}

	getAll(): PlatformSettingsDataMap {
		return this.getConfig();
	}

	private getConfig(): PlatformSettingsDataMap {
		if (!this.config) {
			throw new Error("Platform settings not loaded");
		}

		return this.config;
	}
}
