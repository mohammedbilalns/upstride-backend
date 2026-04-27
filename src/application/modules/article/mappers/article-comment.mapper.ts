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
			userId: entity.isActive ? entity.userId : "",
			authorSnapshot: entity.isActive
				? authorSnapshot
				: { name: "Deleted User", avatarUrl: undefined },
			likesCount: entity.isActive ? (entity.likesCount ?? 0) : 0,
			repliesCount: entity.repliesCount ?? 0,
			content: entity.isActive
				? entity.content
				: "[This comment has been deleted]",
			isActive: entity.isActive,
			createdAt: entity.createdAt as Date,
			updatedAt: entity.updatedAt as Date,
		};
	}
}
