import { AppError } from "../../../application/errors/app-error";
import { ErrorMessage } from "../../../common/enums";
import type { BookMark } from "../../../domain/entities/bookmark.entity";
import type { IBookMarkRepository } from "../../../domain/repositories/bookmark.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { BookMarkModel, type IBookMark } from "../models/bookmark.model";
import { BaseRepository } from "./base.repository";

export class BookMarkRepository
	extends BaseRepository<BookMark, IBookMark>
	implements IBookMarkRepository
{
	constructor() {
		super(BookMarkModel);
	}
	protected mapToDomain(doc: IBookMark): BookMark {
		const mapped = mapMongoDocument(doc);
		if (!mapped) throw new AppError(ErrorMessage.FAILED_TO_MAP_TO_DOMAIN);
		return {
			id: mapped.id,
			userId: mapped.userId,
			articleId: mapped.articleId.toString(),
		};
	}

	async getBookMarkedArticles(
		userId: string,
		page: number,
		limit: number,
		sortBy?: string,
	): Promise<{ articles: BookMark[]; total: number }> {
		const skip = limit * (page - 1);

		const [articles, total] = await Promise.all([
			this._model
				.find({ userId })
				.populate(
					"articleId",
					"title description authorName authorImage featuredImage tags views comments likes createdAt",
				)
				.sort(sortBy || { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.exec(),
			this._model.countDocuments({ userId }),
		]);

		return {
			articles: articles.map(this.mapToDomain),
			total,
		};
	}

	async deleteByUserIdAndArticleId(
		userId: string,
		articleId: string,
	): Promise<void> {
		await this._model.deleteOne({ userId, articleId });
	}
}
