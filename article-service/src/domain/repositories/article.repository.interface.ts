import { IBaseRepository } from "./base.repository.interface";
import { Article } from "../entities/article.entity";

export interface IArticleRepository extends IBaseRepository<Article> {
	findByAuthor(author: string, page: number, limit: number,sortBy?: string,query?: string): Promise<{articles: Article[], total:number}>
	findByCategory(category: string, page: number, limit: number, sortBy?: string,query?: string): Promise<{articles: Article[], total:number}>;
	findByTopic(topic: string, page: number, limit: number, sortBy?: string,query?: string): Promise<{articles: Article[], total:number}>;
	findByTag(tag: string, page: number, limit: number, sortBy?: string,query?: string): Promise<{articles: Article[], total:number}>;
	find(query: string, page: number, limit: number, sortBy?: string): Promise<{articles: Article[], total:number}>;
}

