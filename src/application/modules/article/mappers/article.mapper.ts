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
				isBlocked: entity.authorSnapshot.isBlocked,
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
			isBlockedByAdmin: entity.isBlockedByAdmin,
			blockingReason: entity.blockingReason,
			blockedAt: entity.blockedAt ? entity.blockedAt.toISOString() : null,
			createdAt: (entity.createdAt as Date).toISOString(),
		};
	}

	static toDtos(entities: Article[]): ArticleDto[] {
		return entities.map((entity) => ArticleMapper.toDto(entity));
	}
}
