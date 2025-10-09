import type {
	CreateArticleDto,
	FetchArticlesDto,
	FetchArticlesResponseDto,
	FetchRandomArticlesByAuthorsDto,
	UpdateArticleDto,
} from "../../application/dtos/article.dto";
import type { Article } from "../entities/article.entity";

export interface IArticleService {
	createArticle(createArticleDto: CreateArticleDto): Promise<void>;
	getArticleById(
		id: string,
		userId: string,
	): Promise<{ article: Article; isViewed: boolean; isLiked: boolean }>;
	fetchArticles(
		fetchArticlesDto: FetchArticlesDto,
	): Promise<FetchArticlesResponseDto>;
	updateArticle(article: UpdateArticleDto): Promise<void>;
	deleteArticle(id: string): Promise<void>;
	getRandomArticlesByAuthors(fetchArticlesDto: FetchRandomArticlesByAuthorsDto): Promise<FetchArticlesResponseDto>;
}
