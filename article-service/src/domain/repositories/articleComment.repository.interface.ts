
import { IBaseRepository } from "./base.repository.interface";
import { ArticleComment } from "../entities/articleComment.entity";

export interface IArticleCommentRepository extends IBaseRepository<ArticleComment> {
	findByArticle(articleId: string, page: number, limit: number, parentId?: string): Promise<{comments: ArticleComment[], total:number}>;
}
