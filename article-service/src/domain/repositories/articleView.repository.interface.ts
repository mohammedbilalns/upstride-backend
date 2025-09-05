import { IBaseRepository } from "./base.repository.interface";
import { ArticleView } from "../entities/articleView.entity";

export interface IArticleViewRepository extends IBaseRepository<ArticleView> {
	findByArticle(articleId: string, page: number, limit: number): Promise<ArticleView[]>;
	findByArticleAndUser(articleId: string, userId: string): Promise<ArticleView|null>;
}
