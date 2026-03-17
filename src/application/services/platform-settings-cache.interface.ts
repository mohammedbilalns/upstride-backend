import type { PlatformSettingsDataMap } from "../../domain/entities/platform-settings.entity";

export interface IPlatformSettingsCache {
	get(): Promise<PlatformSettingsDataMap | null>;
	set(settings: PlatformSettingsDataMap): Promise<void>;
	clear(): Promise<void>;
}
