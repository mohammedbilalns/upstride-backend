import { ArticleMetricsResponseDto } from "../../application/dtos/article.dto";
import type { Article } from "../entities/article.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IArticleRepository extends IBaseRepository<Article> {
	findByAuthor(
		author: string,
		page: number,
		limit: number,
		sortBy?: string,
		query?: string,
	): Promise<{ articles: Article[]; total: number }>;
	findByTag(
		tag: string,
		page: number,
		limit: number,
		sortBy?: string,
		query?: string,
	): Promise<{ articles: Article[]; total: number }>;
	find(
		query: string,
		page: number,
		limit: number,
		sortBy?: string,
	): Promise<{ articles: Article[]; total: number }>;

	findRandmoArticlesByAuthor(authorIds:string[], page: number, limit: number, sortBy?: string, query?: string): Promise<{ articles: Article[]; total: number }>;
	findByArticleId(id: string): Promise<Article | null>;
	incrementViewCount(id: string): Promise<void>;
	getArticleMetrics(id: string): Promise<ArticleMetricsResponseDto>;
}
