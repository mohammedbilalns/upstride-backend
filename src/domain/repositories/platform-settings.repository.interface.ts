import type {
	DefaultPlatformSettingsMap,
	PlatformSetting,
	PlatformSettingsType,
} from "../entities/platform-settings.entity";

export interface IPlatformSettingsRepository {
	findAll(): Promise<PlatformSetting[]>;
	findByType<TType extends PlatformSettingsType>(
		type: TType,
	): Promise<PlatformSetting<TType> | null>;
	ensureDefaults(
		settings: DefaultPlatformSettingsMap,
	): Promise<PlatformSetting[]>;
}
