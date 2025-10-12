import type { SavedArticle } from "../entities/savedArticle.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface ISavedArticleRepository extends IBaseRepository<SavedArticle> {
	getSavedArticles(
		userId: string,
		page: number,
		limit: number,
		sortBy?: string,
	): Promise<{ articles: SavedArticle[]; total: number }>;
}
