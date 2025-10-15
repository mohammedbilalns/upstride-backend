import { Types } from "mongoose";
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
			createdAt: mapped.createdAt,
		};
	}

	async findByArticle(
		articleId: string,
		page: number,
		limit: number,
		parentId?: string,
	): Promise<{ comments: ArticleComment[]; total: number }> {
		const filter: Record<string, string | Record<string, boolean>> = {
			articleId,
		};
		if (parentId) {
			filter.parentId = parentId;
		} else {
			filter.parentId = { $exists: false };
		}
		const [comments, total] = await Promise.all([
			this._model
				.find(filter)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.exec(),
			this._model.countDocuments(filter).exec(),
		]);

		return {
			comments: comments.map(this.mapToDomain),
			total,
		};
	}
	async incrementLikes(commentId: string): Promise<void> {
		await this._model.updateOne({ _id: commentId }, { $inc: { likes: 1 } });
	}

	async incrementReplies(commentId: string): Promise<void> {
		await this._model.updateOne({ _id: commentId }, { $inc: { replies: 1 } });
	}

	async incrementRepliesWithParent(commentId: string): Promise<void> {

		const parentComments = await this._model.aggregate([
			{$match: {_id : new Types.ObjectId(commentId)}},
			{$graphLookup:{
				from:"articlecomments",
				startWith:"$parentId",
				connectFromField:"parentId",
				connectToField:"_id",
				as:"parents"
			}},
			{ $project: { parentIds: "$parents._id" } }

		])

    if (parentComments.length > 0 && parentComments[0].parentIds.length > 0) {
      await ArticleCommentModel.updateMany(
        { _id: { $in: parentComments[0].parentIds } },
        { $inc: { replies: 1 } }
      );
    }
	}

	async deleteByArticle(articleId: string): Promise<void> {
		await this._model.deleteMany({ articleId });
	}
	async fetchCommentsByArticle(articleId: string): Promise<string[]> {
		return this._model.find({ articleId }).select("_id").lean().then((docs) => docs.map((doc) => doc._id.toString()));
	}
}
