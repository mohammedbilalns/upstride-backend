import type { ArticleReaction } from "../../../domain/entities/articleReaction.entity";
import type { IArticleReactionRepository } from "../../../domain/repositories/articleReaction.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import {
	ArticleReactionModel,
	type IArticleReaction,
} from "../models/articleReaction.model";
import { BaseRepository } from "./base.repository";

export class ArticleReactionRepository
	extends BaseRepository<ArticleReaction, IArticleReaction>
	implements IArticleReactionRepository
{
	constructor() {
		super(ArticleReactionModel);
	}
	protected mapToDomain(doc: IArticleReaction): ArticleReaction {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			articleId: mapped.articleId.toString(),
			userId: mapped.userId,
			userName: mapped.userName,
			userImage: mapped.userImage,
			reaction: mapped.reaction,
			createdAt: mapped.createdAt,
		};
	}

	async findByArticle(
		articleId: string,
		page: number,
		limit: number,
	): Promise<ArticleReaction[]> {
		const articles = await this._model
			.find({ articleId: articleId })
			.skip(page * limit)
			.limit(limit)
			.lean()
			.exec();
		return articles.map(this.mapToDomain);
	}

	async findByArticleAndUser(
		articleId: string,
		userId: string,
	): Promise<ArticleReaction | null> {
		const article = await this._model
			.findOne({ articleId: articleId, userId: userId })
			.lean()
			.exec();
		return article ? this.mapToDomain(article) : null;
	}
}
