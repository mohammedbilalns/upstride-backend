import type { ArticleComment } from "../entities/article-comment.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ArticleCommentQuery {
	articleId?: string;
	parentId?: string | null;
	userId?: string;
	isActive?: boolean;
}

export interface IArticleCommentRepository
	extends CreatableRepository<ArticleComment>,
		FindByIdRepository<ArticleComment>,
		UpdatableByIdRepository<ArticleComment>,
		QueryableRepository<ArticleComment, ArticleCommentQuery>,
		PaginatableRepository<ArticleComment, ArticleCommentQuery> {}
