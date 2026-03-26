import type { Article } from "../entities/article.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ArticleQuery {
	authorId?: string | string[];
	isActive?: boolean;
	isArchived?: boolean;
	tags?: string | string[];
	title?: string;
	slug?: string;
	excludeAuthorId?: string;
	ids?: string[];
}

export interface IArticleRepository
	extends CreatableRepository<Article>,
		FindByIdRepository<Article>,
		UpdatableByIdRepository<Article>,
		QueryableRepository<Article, ArticleQuery>,
		PaginatableRepository<Article, ArticleQuery> {
	findBySlug(slug: string): Promise<Article | null>;
	updateAuthorSnapshotByAuthorId(
		authorId: string,
		snapshot: { name?: string; avatarUrl?: string },
	): Promise<void>;
	getTopTags(
		limit: number,
		excludeAuthorId?: string,
	): Promise<{ tag: string; count: number }[]>;
}
