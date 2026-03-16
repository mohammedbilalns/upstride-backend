import type {
	DefaultPlatformSettingsMap,
	PlatformSetting,
	PlatformSettingsDataMap,
	PlatformSettingsType,
} from "../entities/platform-settings.entity";

export interface IPlatformSettingsRepository {
	findAll(): Promise<PlatformSetting[]>;
	findByType<TType extends PlatformSettingsType>(
		type: TType,
	): Promise<PlatformSetting<TType> | null>;
	updateByType<TType extends PlatformSettingsType>(
		type: TType,
		data: PlatformSettingsDataMap[TType],
	): Promise<PlatformSetting<TType> | null>;
	ensureDefaults(
		settings: DefaultPlatformSettingsMap,
	): Promise<PlatformSetting[]>;
}
