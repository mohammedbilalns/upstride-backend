import type {
	ArticleReaction,
	ArticleReactionType,
} from "../entities/article-reaction.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ArticleReactionQuery {
	resourceId?: string;
	userId?: string;
	reactionType?: ArticleReactionType;
}

export interface IArticleReactionRepository
	extends CreatableRepository<ArticleReaction>,
		FindByIdRepository<ArticleReaction>,
		QueryableRepository<ArticleReaction, ArticleReactionQuery>,
		UpdatableByIdRepository<ArticleReaction> {
	deleteById(id: string): Promise<void>;
}
