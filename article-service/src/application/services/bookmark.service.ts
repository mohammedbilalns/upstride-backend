import type { BookMark } from "../../domain/entities/bookmark.entity";
import type { IBookMarkRepository } from "../../domain/repositories/bookmark.repository.interface";
import type { IBookMarkService } from "../../domain/services/bookmark.service.interface";

export class BookMarkService implements IBookMarkService {
	constructor(private _bookMarkRepository: IBookMarkRepository) {}

	async fetchBookMarkedArticles(
		userId: string,
		page: number,
		limit: number,
		sortBy?: string,
	): Promise<{ articles: BookMark[]; total: number }> {
		const { articles, total } =
			await this._bookMarkRepository.getBookMarkedArticles(
				userId,
				page,
				limit,
				sortBy,
			);

		return {
			articles,
			total,
		};
	}
	async saveArticle(userId: string, articleId: string): Promise<void> {
		await this._bookMarkRepository.create({ userId, articleId });
	}

	async deleteBookMark(userId: string, articleId: string): Promise<void> {
		await this._bookMarkRepository.deleteByUserIdAndArticleId(
			userId,
			articleId,
		);
	}
}
