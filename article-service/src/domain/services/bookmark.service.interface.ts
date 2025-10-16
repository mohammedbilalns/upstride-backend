import type { BookMark } from "../entities/bookmark.entity";

export interface IBookMarkService {
	fetchBookMarkedArticles(
		userId: string,
		page: number,
		limit: number,
		sortBy?: string,
	): Promise<{ articles: BookMark[]; total: number }>;
	saveArticle(userId: string, articleId: string): Promise<void>;
	deleteBookMark(userId: string, articleId: string): Promise<void>;
}
