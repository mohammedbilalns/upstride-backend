import { BaseRepository } from "./base.repository";
import { IArticleRepository } from "../../../domain/repositories/article.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ArticleModel, IArticle } from "../models/article.model";
import { Article } from "../../../domain/entities/article.entity";
import * as mongoose from "mongoose";

export class ArticleRepository extends BaseRepository<Article, IArticle> implements IArticleRepository {
    constructor() {
        super(ArticleModel);
    }

    protected mapToDomain(doc: IArticle): Article {
        const mapped = mapMongoDocument(doc)!;
        return {
            id: mapped.id,
            authorName: mapped.authorName,
            authorImage: mapped.authorImage,
            featuredImage: mapped.featuredImage,
            title: mapped.title,
            category: mapped.category,
            topics: mapped.topics,
            author: mapped.author,
            tags: mapped.tags,
            description: mapped.description,
            isActive: mapped.isActive,
            views: mapped.views,
            comments: mapped.comments,
            likes: mapped.likes,
            isArchived: mapped.isArchived,
            content: mapped.content,
        }
    }

    private buildSearchFilter(query?: string): any {
        if (!query) return {};
        
        const regex = new RegExp(query, 'i');
        return {
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { content: { $regex: regex } }
            ]
        };
    }

    private buildFilter(baseFilter: any, query?: string): any {
        const searchFilter = this.buildSearchFilter(query);
        if (!query) return baseFilter;
        
        return {
            $and: [
                baseFilter,
                searchFilter
            ]
        };
    }

    async findByAuthor(author: string, page: number, limit: number, sortBy?: string, query?: string): Promise<{articles: Article[], total:number}> {
        const skip = (page - 1) * limit;
        const filter = this.buildFilter({ author }, query);
        
        const [articles, total] = await Promise.all([
            this._model.find(filter)
                .sort(sortBy || { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(filter)
        ]);

        return {
            articles: articles.map(this.mapToDomain),
            total,
        };
    }

    async findByCategory(category: string, page: number, limit: number, sortBy?: string, query?: string): Promise<{articles: Article[], total:number}> {
        const skip = (page - 1) * limit;
        const filter = this.buildFilter({ category }, query);
        
        const [articles, total] = await Promise.all([
            this._model.find(filter)
                .sort(sortBy || { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(filter)
        ]);

        return {
            articles: articles.map(this.mapToDomain),
            total,
        };
    }

    async findByTopic(topic: string, page: number, limit: number, sortBy?: string, query?: string): Promise<{articles: Article[], total:number}> {
        const skip = (page - 1) * limit;
        const filter = this.buildFilter({ topics: { $in: [topic] } }, query);
        
        const [articles, total] = await Promise.all([
            this._model.find(filter)
                .sort(sortBy || { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(filter)
        ]);

        return {
            articles: articles.map(this.mapToDomain),
            total,
        };
    }

    async findByTag(tagId: string, page: number, limit: number, sortBy?: string, query?: string): Promise<{articles: Article[], total:number}> {
        const skip = (page - 1) * limit;
        
        const objectId = new mongoose.Types.ObjectId(tagId);
        const filter = this.buildFilter({ tags: objectId }, query);
        
        const [articles, total] = await Promise.all([
            this._model.find(filter)
                .sort(sortBy || { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(filter)
        ]);

        return {
            articles: articles.map(this.mapToDomain),
            total,
        };
    }

	async find(query: string, page: number, limit: number, sortBy?: string): Promise<{articles: Article[], total:number}> {
        const skip = (page - 1) * limit;
        const filter = this.buildFilter({ $text: { $search: query } }, query);
        
        const [articles, total] = await Promise.all([
            this._model.find(filter)
                .sort(sortBy || { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(filter)
        ]);

        return {
            articles: articles.map(this.mapToDomain),
            total,
        };
    }
}
