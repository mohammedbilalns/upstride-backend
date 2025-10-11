import type { ArticleComment } from "../../../domain/entities/articleComment.entity";
import type { IArticleCommentRepository } from "../../../domain/repositories/articleComment.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import {
	ArticleCommentModel,
	type IArticleComment,
} from "../models/articleComment.model";
import { BaseRepository } from "./base.repository";

export class ArticleCommentRepository
	extends BaseRepository<ArticleComment, IArticleComment>
	implements IArticleCommentRepository
{
	constructor() {
		super(ArticleCommentModel);
	}
	protected mapToDomain(doc: IArticleComment): ArticleComment {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			articleId: mapped.articleId,
			parentId: mapped.parentId,
			userId: mapped.userId,
			userName: mapped.userName,
			userImage: mapped.userImage,
			likes: mapped.likes,
			replies: mapped.replies,
			content: mapped.content,
			isActive: mapped.isActive,
		};
	}

	async findByArticle(
		articleId: string,
		page: number,
		limit: number,
		parentId?: string,
	): Promise<{ comments: ArticleComment[]; total: number }> {
		if (parentId) {
			const articles = await this._model
				.find({ articleId: articleId, parentId: parentId })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean()
				.exec();
			return {
				comments: articles.map(this.mapToDomain),
				total: articles.length,
			};
		}
		const articles = await this._model
			.find({ articleId: articleId })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean()
			.exec();
		return {
			comments: articles.map(this.mapToDomain),
			total: articles.length,
		};
	}
	async incrementLikes(commentId: string): Promise<void> {
		await this._model.updateOne({ _id: commentId }, { $inc: { likes: 1 } });
	}

	async incrementReplies(commentId: string): Promise<void> {
		await this._model.updateOne({ _id: commentId }, { $inc: { replies: 1 } });
	}
}
