import type { PlatformSettingsDataMap } from "../../shared/config/platform-settings.defaults";

export interface IPlatformSettingsCache {
	get(): Promise<PlatformSettingsDataMap | null>;
	set(settings: PlatformSettingsDataMap): Promise<void>;
	clear(): Promise<void>;
}
