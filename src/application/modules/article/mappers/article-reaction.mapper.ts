import type { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import type { ArticleReactionDto } from "../dtos/article-reaction.dto";

export class ArticleReactionMapper {
	static toDto(entity: ArticleReaction): ArticleReactionDto {
		return {
			id: entity.id,
			resourceId: entity.resourceId,
			userId: entity.userId,
			reactionType: entity.reactionType,
			createdAt: entity.createdAt as Date,
		};
	}
}
