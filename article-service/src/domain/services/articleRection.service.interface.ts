import type { ArticleReactionDto } from "../../application/dtos/articleReaction.dto";
import type { ArticleReaction } from "../entities/articleReaction.entity";

export interface IArticleRectionService {
	reactToArticle(articleReactionDto: ArticleReactionDto): Promise<void>;
	getReactions(
		articleId: string,
		page: number,
		limit: number,
	): Promise<Partial<ArticleReaction>[]>;
}
