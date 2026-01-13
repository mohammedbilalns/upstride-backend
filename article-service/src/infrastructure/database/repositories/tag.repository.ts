import { AppError } from "../../../application/errors/app-error";
import { ErrorMessage } from "../../../common/enums";
import type { Tag } from "../../../domain/entities/tag.entity";
import type { ITagRepository } from "../../../domain/repositories/tag.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type ITag, TagModel } from "../models/tag.model";
import { BaseRepository } from "./base.repository";

export class TagRepository
	extends BaseRepository<Tag, ITag>
	implements ITagRepository
{
	constructor() {
		super(TagModel);
	}
	protected mapToDomain(doc: ITag): Tag {
		const mapped = mapMongoDocument(doc);
		if (!mapped) throw new AppError(ErrorMessage.FAILED_TO_MAP_TO_DOMAIN);
		return {
			id: mapped.id,
			name: mapped.name,
			promoted: mapped.promoted,
			usageCount: mapped.usageCount,
			createdAt: mapped.createdAt,
		};
	}

	async createOrIncrement(tags: string[]): Promise<string[]> {
		this._model.deleteMany({});
		const bulkOps = tags.map((tagName) => ({
			updateOne: {
				filter: { name: tagName },
				update: {
					$setOnInsert: {
						name: tagName,
						createdAt: new Date(),
					},
					$inc: { usageCount: 1 },
				},
				upsert: true,
			},
		}));

		await this._model.bulkWrite(bulkOps, { ordered: false });

		const tagDocs = await this._model
			.find({ name: { $in: tags } })
			.select("_id")
			.lean();

		return tagDocs.map((doc) => doc._id.toString());
	}

	async deleteOrDecrement(tags: string[]): Promise<void> {
		await this._model.updateMany(
			{ name: { $in: tags } },
			{ $inc: { usageCount: -1 } },
		);

		await this._model.deleteMany({
			name: { $in: tags },
			usageCount: { $lte: 0 },
		});
	}

	async findByName(tag: string): Promise<Tag | null> {
		const doc = await this._model.findOne({ name: tag }).exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	async findMostUsed(limit: number): Promise<Tag[]> {
		const docs = await this._model.find().sort({ usageCount: -1 }).limit(limit);
		return docs.map((doc) => this.mapToDomain(doc));
	}
}
