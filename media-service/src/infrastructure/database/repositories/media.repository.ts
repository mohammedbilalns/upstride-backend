import type { Model } from "mongoose";
import type {
	getMediaDto,
	getMediasDto,
	IMediaDto,
} from "../../../application/dtos/media.dto";
import type { Media } from "../../../domain/entities/media.entity";
import type { IMediaRepository } from "../../../domain/repositories/media.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type IMedia, mediaModel } from "../models/media.model";

export class MediaRepository implements IMediaRepository {
	constructor(protected _model: Model<IMedia> = mediaModel) {}

	protected mapToDomain(doc: IMedia): Media {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			mediaType: mapped.mediaType,
			category: mapped.category,
			publicId: mapped.publicId,
			originalName: mapped.originalName,
			url: mapped.url,
			size: mapped.size,
			articleId: mapped.articleId,
			chatMessageId: mapped.chatMessageId,
			mentorId: mapped.mentorId,
			userId: mapped.userId,
		};
	}

	async create(media: IMediaDto): Promise<Media> {
		const doc = await this._model.create(media);
		return this.mapToDomain(doc);
	}

	async findOne(data: getMediaDto): Promise<Media> {
		const doc = await this._model.findOne(data);
		return this.mapToDomain(doc!);
	}

	async findAll(data: getMediasDto): Promise<Media[]> {
		const docs = await this._model
			.find({
				publicId: { $in: data.publicIds },
			})
			.exec();

		return docs.map((doc) => this.mapToDomain(doc));
	}

	async delete(data: getMediaDto): Promise<void> {
		await this._model.deleteOne(data);
	}
}
