import type { BookMark } from "../entities/bookmark.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IBookMarkRepository extends IBaseRepository<BookMark> {
	getBookMarkedArticles(
		userId: string,
		page: number,
		limit: number,
		sortBy?: string,
	): Promise<{ articles: BookMark[]; total: number }>;
	deleteByUserIdAndArticleId(userId: string, articleId: string): Promise<void>;
}
