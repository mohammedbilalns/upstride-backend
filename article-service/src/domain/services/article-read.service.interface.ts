import type {
	FetchArticlesDto,
	FetchArticlesResponseDto,
	FetchRandomArticlesByAuthorsDto,
} from "../../application/dtos/article.dto";
import type { Article } from "../entities/article.entity";

export interface IArticleReadService {
	getArticleById(
		id: string,
		userId: string,
	): Promise<{
		article: Omit<Article, "isActive" | "isArchived">;
		isViewed: boolean;
		isLiked: boolean;
	}>;
	fetchArticles(
		fetchArticlesDto: FetchArticlesDto,
	): Promise<FetchArticlesResponseDto>;
	getRandomArticlesByAuthors(
		fetchArticlesDto: FetchRandomArticlesByAuthorsDto,
	): Promise<FetchArticlesResponseDto>;
}
