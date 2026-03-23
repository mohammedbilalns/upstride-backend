import type { PlatformSettingsDataMap } from "../../shared/config/platform-settings.defaults";

//FIX: use interface here
export interface PlatformSettingsService {
	load(forceRefresh?: boolean): Promise<void>;
	refresh(): Promise<void>;
	invalidate(): Promise<void>;

	get economy(): PlatformSettingsDataMap["economy"];
	get mentors(): PlatformSettingsDataMap["mentors"];
	get sessions(): PlatformSettingsDataMap["sessions"];
	get content(): PlatformSettingsDataMap["content"];

	getAll(): PlatformSettingsDataMap;
}
