import type { PlatformSettingsDataMap } from "../../shared/config/platform-settings.defaults";

//FIX: use interface here
export abstract class PlatformSettingsService {
	abstract load(forceRefresh?: boolean): Promise<void>;
	abstract refresh(): Promise<void>;
	abstract invalidate(): Promise<void>;

	abstract get economy(): PlatformSettingsDataMap["economy"];
	abstract get mentors(): PlatformSettingsDataMap["mentors"];
	abstract get sessions(): PlatformSettingsDataMap["sessions"];
	abstract get content(): PlatformSettingsDataMap["content"];

	abstract getAll(): PlatformSettingsDataMap;
}
