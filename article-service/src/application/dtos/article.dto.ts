import type { Article } from "../../domain/entities/article.entity";



interface FeaturedImage {
	public_id: string, 
	original_filename: string, 
	resource_type: string, 
	secure_url: string, 
	bytes: number, 
	asset_folder: string
}

export interface CreateArticleDto {
	author: string,
	authorName: string;
	authorImage: string;
	authorRole: string;
	featuredImage?: FeaturedImage;
	title: string;
	tags: string[];
	content: string;
}

export interface UpdateArticleDto {
	id: string;
	title?: string;
	userId: string;
	featuredImage?: FeaturedImage;
	category?: string;
	topics?: string[];
	tags?: string[];
	content?: string;
}

export interface FetchArticlesDto {
	userId?: string;
	page: number;
	sortBy?: string;
	author?: string;
	category?: string;
	tag?: string;
	query: string;
}

export interface FetchArticlesResponseDto {
	articles: Partial<Article>[];
	total: number;
}


export interface FetchRandomArticlesByAuthorsDto {
    authorIds?: string[];
    search?: string;
    page: number;
    limit: number;
    sortBy?: string; 
}

