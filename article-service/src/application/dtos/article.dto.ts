import type { Article } from "../../domain/entities/article.entity";

export interface CreateArticleDto {
	author: string;
	authorName: string;
	authorImage: string;
	featuredImage: string;
	title: string;
	category: string;
	topics: string[];
	tags: string[];
	content: string;
}

export interface UpdateArticleDto {
	id: string;
	title?: string;
	userId: string;
	featuredImage?: string;
	category?: string;
	topics?: string[];
	tags?: string[];
	content?: string;
}

export interface FetchArticlesDto {
	userId?: string;
	page: number;
	limit: number;
	sortBy?: string;
	author?: string;
	category?: string;
	topic?: string;
	tag?: string;
	query: string;
}

export interface FetchArticlesResponseDto {
	articles: Partial<Article>[];
	total: number;
}
