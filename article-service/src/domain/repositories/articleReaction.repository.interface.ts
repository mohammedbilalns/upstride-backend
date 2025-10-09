import type { ArticleReaction } from "../entities/articleReaction.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IArticleReactionRepository
	extends IBaseRepository<ArticleReaction> {
	findByArticle(
		articleId: string,
		page: number,
		limit: number,
	): Promise<ArticleReaction[]>;
	findByArticleAndUser(
		articleId: string,
		userId: string,
	): Promise<ArticleReaction | null>;
}
