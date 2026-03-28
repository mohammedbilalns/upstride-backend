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
			featuredImageId: entity.featuredImageUrl,
			title: entity.title,
			description: entity.description,
			previewContent: entity.previewContent,
			tags: entity.tags,
			views: entity.views,
			commentsCount: entity.commentsCount ?? 0,
			likesCount: entity.likesCount ?? 0,
			createdAt: entity.createdAt as Date,
		};
	}

	static toDtos(entities: Article[]): ArticleDto[] {
		return entities.map((entity) => ArticleMapper.toDto(entity));
	}
}
