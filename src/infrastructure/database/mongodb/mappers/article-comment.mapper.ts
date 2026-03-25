import { Types } from "mongoose";
import { ArticleComment } from "../../../../domain/entities/article-comment.entity";
import type { ArticleCommentDocument } from "../models/article-comment.model";

export class ArticleCommentMapper {
	static toDomain(doc: ArticleCommentDocument): ArticleComment {
		return new ArticleComment(
			doc._id.toString(),
			doc.articleId.toString(),
			doc.parentId ? doc.parentId.toString() : null,
			doc.userId.toString(),
			doc.likesCount,
			doc.repliesCount,
			doc.content,
			doc.isActive,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: ArticleComment): Partial<ArticleCommentDocument> {
		return {
			articleId: new Types.ObjectId(entity.articleId),
			parentId: entity.parentId ? new Types.ObjectId(entity.parentId) : null,
			userId: new Types.ObjectId(entity.userId),
			likesCount: entity.likesCount,
			repliesCount: entity.repliesCount,
			content: entity.content,
			isActive: entity.isActive,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
