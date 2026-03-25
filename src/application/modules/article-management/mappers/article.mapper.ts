import type { Article } from "../../../../domain/entities/article.entity";
import type { ArticleDto } from "../dtos/article.dto";

export class ArticleMapper {
	static toDto(entity: Article): ArticleDto {
		return {
			id: entity.id,
			authorId: entity.authorId,
			authorSnapshot: {
				name: entity.authorSnapshot.name,
				avatarUrl: entity.authorSnapshot.avatarUrl,
			},
			slug: entity.slug,
			featuredImageUrl: entity.featuredImageUrl,
			title: entity.title,
			description: entity.description,
			previewContent: entity.previewContent,
			tags: entity.tags,
			isActive: entity.isActive,
			views: entity.views,
			commentsCount: entity.commentsCount,
			isArchived: entity.isArchived,
			createdAt: entity.createdAt as Date,
			updatedAt: entity.updatedAt as Date,
		};
	}

	static toDtos(entities: Article[]): ArticleDto[] {
		return entities.map((entity) => ArticleMapper.toDto(entity));
	}
}
