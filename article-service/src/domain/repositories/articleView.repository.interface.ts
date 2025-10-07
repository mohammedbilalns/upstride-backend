import type { ArticleView } from "../entities/articleView.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IArticleViewRepository extends IBaseRepository<ArticleView> {
	findByArticle(
		articleId: string,
		page: number,
		limit: number,
	): Promise<ArticleView[]>;
	findByArticleAndUser(
		articleId: string,
		userId: string,
	): Promise<ArticleView | null>;
}
