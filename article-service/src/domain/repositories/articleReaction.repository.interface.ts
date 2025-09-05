import { IBaseRepository } from "./base.repository.interface";
import { ArticleReaction } from "../entities/articleReaction.entity";

export interface IArticleReactionRepository extends IBaseRepository<ArticleReaction> {
	findByArticle(articleId: string, page: number, limit: number): Promise<ArticleReaction[]>;
	findByArticleAndUser(articleId: string, userId: string): Promise<ArticleReaction|null>;
}
