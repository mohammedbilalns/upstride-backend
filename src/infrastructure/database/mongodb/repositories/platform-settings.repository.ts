import { injectable } from "inversify";
import type {
	DefaultPlatformSettingsMap,
	PlatformSetting,
	PlatformSettingsType,
} from "../../../../domain/entities/platform-settings.entity";
import { PlatformSetting as PlatformSettingEntity } from "../../../../domain/entities/platform-settings.entity";
import type { IPlatformSettingsRepository } from "../../../../domain/repositories/platform-settings.repository.interface";
import { PlatformSettingsMapper } from "../mappers/platform-settings.mapper";
import {
	type PlatformSettingDocument,
	PlatformSettingsModel,
} from "../models/platform-settings.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoPlatformSettingsRepository
	extends AbstractMongoRepository<PlatformSetting, PlatformSettingDocument>
	implements IPlatformSettingsRepository
{
	constructor() {
		super(PlatformSettingsModel);
	}

	protected toDomain(doc: PlatformSettingDocument): PlatformSetting {
		return PlatformSettingsMapper.toDomain(doc);
	}

	protected toDocument(
		entity: PlatformSetting,
	): Partial<PlatformSettingDocument> {
		return PlatformSettingsMapper.toDocument(entity);
	}

	async findAll(): Promise<PlatformSetting[]> {
		const docs = await this.model.find().sort({ type: 1 }).lean();
		return docs.map((doc) => this.toDomain(doc as PlatformSettingDocument));
	}

	async findByType<TType extends PlatformSettingsType>(
		type: TType,
	): Promise<PlatformSetting<TType> | null> {
		const doc = await this.model.findOne({ type }).lean();
		return doc
			? (this.toDomain(
					doc as PlatformSettingDocument,
				) as PlatformSetting<TType>)
			: null;
	}

	async ensureDefaults(
		settings: DefaultPlatformSettingsMap,
	): Promise<PlatformSetting[]> {
		const defaultSettings = Object.keys(settings).map((type) =>
			PlatformSettingEntity.createDefault(type as PlatformSettingsType),
		);

		if (defaultSettings.length > 0) {
			await this.model.bulkWrite(
				defaultSettings.map((setting) => ({
					updateOne: {
						filter: { type: setting.type },
						update: {
							$setOnInsert: PlatformSettingsMapper.toDocument(setting),
						},
						upsert: true,
					},
				})),
			);
		}

		return this.findAll();
	}
}
