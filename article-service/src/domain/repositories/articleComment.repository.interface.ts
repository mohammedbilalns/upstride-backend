import type { ArticleComment } from "../entities/articleComment.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IArticleCommentRepository
	extends IBaseRepository<ArticleComment> {
	findByArticle(
		articleId: string,
		page: number,
		limit: number,
		parentId?: string,
	): Promise<{ comments: ArticleComment[]; total: number }>;
	incrementLikes(commentId: string): Promise<void>;
	incrementReplies(commentId: string): Promise<void>;
	incrementRepliesWithParent(commentId: string): Promise<void>;
	deleteByArticle(articleId: string): Promise<void>;
	fetchCommentsByArticle(articleId: string): Promise<string[]>;
}
