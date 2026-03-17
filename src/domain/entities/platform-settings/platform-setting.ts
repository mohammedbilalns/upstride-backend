import { randomUUID } from "node:crypto";
import {
	DEFAULT_PLATFORM_SETTINGS,
	type PlatformSettingsDataMap,
} from "../../config/platform-settings.defaults";
import type { PlatformSettingsType } from "./shared";

export class PlatformSetting<
	TType extends PlatformSettingsType = PlatformSettingsType,
> {
	constructor(
		public readonly id: string,
		public readonly type: TType,
		public readonly data: PlatformSettingsDataMap[TType],
		public readonly version: number,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}

	static createDefault<TType extends PlatformSettingsType>(
		type: TType,
	): PlatformSetting<TType> {
		const now = new Date();

		return new PlatformSetting(
			randomUUID(),
			type,
			DEFAULT_PLATFORM_SETTINGS[type],
			1,
			now,
			now,
		);
	}
}

export class CreatePlatformSetting<
	TType extends PlatformSettingsType = PlatformSettingsType,
> {
	constructor(
		public readonly type: TType,
		public readonly data: PlatformSettingsDataMap[TType],
		public readonly version: number = 1,
	) {}
}
