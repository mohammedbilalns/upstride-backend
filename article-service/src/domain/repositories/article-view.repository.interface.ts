import type { ArticleView } from "../entities/article-view.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IArticleViewRepository extends IBaseRepository<ArticleView> {
	findByArticleAndUser(
		articleId: string,
		userId: string,
	): Promise<ArticleView | null>;
	deleteByArticle(articleId: string): Promise<void>;
}
