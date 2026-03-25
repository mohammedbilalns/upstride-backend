import type { ArticleReactionType } from "../../../../domain/entities/article-reaction.entity";

export interface ArticleReactionDto {
	id: string;
	resourceId: string;
	userId: string;
	reactionType: ArticleReactionType;
	createdAt: Date;
}
