import type { ArticleComment } from "../../../../domain/entities/article-comment.entity";
import type { ArticleCommentDto } from "../dtos/article-comment.dto";

export class ArticleCommentMapper {
	static toDto(entity: ArticleComment): ArticleCommentDto {
		return {
			id: entity.id,
			articleId: entity.articleId,
			parentId: entity.parentId,
			userId: entity.userId,
			likesCount: entity.likesCount,
			repliesCount: entity.repliesCount,
			content: entity.content,
			isActive: entity.isActive,
			createdAt: entity.createdAt as Date,
			updatedAt: entity.updatedAt as Date,
		};
	}

	static toDtos(entities: ArticleComment[]): ArticleCommentDto[] {
		return entities.map((entity) => ArticleCommentMapper.toDto(entity));
	}
}
