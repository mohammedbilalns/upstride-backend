import type {
	CreateArticleDto,
	UpdateArticleDto,
} from "../../application/dtos/article.dto";

export interface IArticleWriteService {
	createArticle(createArticleDto: CreateArticleDto): Promise<void>;
	updateArticle(article: UpdateArticleDto): Promise<void>;
	deleteArticle(articleId: string, userId: string): Promise<void>;
}
