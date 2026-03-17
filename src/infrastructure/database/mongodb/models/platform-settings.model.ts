import { model, Schema, type Types } from "mongoose";
import {
	type PlatformSettingsDataMap,
	type PlatformSettingsType,
	PlatformSettingsTypeValues,
} from "../../../../domain/entities/platform-settings.entity";

export interface PlatformSettingDocument<
	TType extends PlatformSettingsType = PlatformSettingsType,
> {
	_id: Types.ObjectId;
	type: TType;
	data: PlatformSettingsDataMap[TType];
	version: number;
	createdAt: Date;
	updatedAt: Date;
}

const platformSettingsSchema = new Schema<PlatformSettingDocument>(
	{
		type: {
			type: String,
			required: true,
			enum: PlatformSettingsTypeValues,
			unique: true,
		},
		data: {
			type: Schema.Types.Mixed,
			required: true,
		},
		version: {
			type: Number,
			required: true,
			default: 1,
		},
	},
	{ timestamps: true },
);

export const PlatformSettingsModel = model<PlatformSettingDocument>(
	"Settings",
	platformSettingsSchema,
);
