import type { ArticleView } from "../entities/article-view.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	QueryableRepository,
} from "./capabilities";

export interface ArticleViewQuery {
	articleId?: string;
	userId?: string;
}

export interface IArticleViewRepository
	extends CreatableRepository<ArticleView>,
		FindByIdRepository<ArticleView>,
		QueryableRepository<ArticleView, ArticleViewQuery> {
	upsert(articleId: string, userId: string): Promise<boolean>;
}
