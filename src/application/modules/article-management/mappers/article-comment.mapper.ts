import type { ArticleComment } from "../../../../domain/entities/article-comment.entity";
import type { ArticleAuthorSnapshotDto } from "../dtos/article.dto";
import type { ArticleCommentDto } from "../dtos/article-comment.dto";

export class ArticleCommentMapper {
	static toDto(
		entity: ArticleComment,
		authorSnapshot: ArticleAuthorSnapshotDto,
	): ArticleCommentDto {
		return {
			id: entity.id,
			articleId: entity.articleId,
			parentId: entity.parentId,
			userId: entity.userId,
			authorSnapshot,
			likesCount: entity.likesCount ?? 0,
			repliesCount: entity.repliesCount ?? 0,
			content: entity.content,
			isActive: entity.isActive,
			createdAt: entity.createdAt as Date,
			updatedAt: entity.updatedAt as Date,
		};
	}
}
