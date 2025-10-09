import * as mongoose from "mongoose";
import type { Article } from "../../../domain/entities/article.entity";
import type { IArticleRepository } from "../../../domain/repositories/article.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ArticleModel, type IArticle } from "../models/article.model";
import { BaseRepository } from "./base.repository";

export class ArticleRepository
  extends BaseRepository<Article, IArticle>
  implements IArticleRepository
{
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
      author: mapped.author,
      tags: mapped.tags,
      description: mapped.description,
      isActive: mapped.isActive,
      views: mapped.views,
      comments: mapped.comments,
      likes: mapped.likes,
      isArchived: mapped.isArchived,
      content: mapped.content,
      createdAt: mapped.createdAt,
    };
  }

  private buildSearchFilter(query?: string): any {
    if (!query) return {};

    const regex = new RegExp(query, "i");
    return {
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { content: { $regex: regex } },
      ],
    };
  }

  private buildFilter(baseFilter: any, query?: string): any {
    const searchFilter = this.buildSearchFilter(query);
    if (!query) return baseFilter;

    return {
      $and: [baseFilter, searchFilter],
    };
  }

  async findByAuthor(
    author: string,
    page: number,
    limit: number,
    sortBy?: string,
    query?: string
  ): Promise<{ articles: Article[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = this.buildFilter({ author }, query);

    const [articles, total] = await Promise.all([
      this._model
        .find(filter)
        .sort(sortBy || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._model.countDocuments(filter),
    ]);

    return {
      articles: articles.map(this.mapToDomain),
      total,
    };
  }

  async findByTopic(
    topic: string,
    page: number,
    limit: number,
    sortBy?: string,
    query?: string
  ): Promise<{ articles: Article[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = this.buildFilter({ topics: { $in: [topic] } }, query);

    const [articles, total] = await Promise.all([
      this._model
        .find(filter)
        .sort(sortBy || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._model.countDocuments(filter),
    ]);

    return {
      articles: articles.map(this.mapToDomain),
      total,
    };
  }

  async findByTag(
    tagId: string,
    page: number,
    limit: number,
    sortBy?: string,
    query?: string
  ): Promise<{ articles: Article[]; total: number }> {
    const skip = (page - 1) * limit;

    const objectId = new mongoose.Types.ObjectId(tagId);
    const filter = this.buildFilter({ tags: objectId }, query);

    const [articles, total] = await Promise.all([
      this._model
        .find(filter)
			  .populate("tags", "id name")
        .sort(sortBy || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._model.countDocuments(filter),
    ]);

    return {
      articles: articles.map(this.mapToDomain),
      total,
    };
  }

  async find(
    query: string,
    page: number,
    limit: number,
    sortBy?: string
  ): Promise<{ articles: Article[]; total: number }> {
    const skip = (page - 1) * limit;

    let filter = {};
    if (query && query.trim() !== "") {
      filter = { $text: { $search: query } };
    }

    const [articles, total] = await Promise.all([
      this._model
        .find(filter)
        .populate("tags", "id name")
        .sort(sortBy || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._model.countDocuments(filter),
    ]);

    return {
      articles: articles.map(this.mapToDomain),
      total,
    };
  }


async findRandmoArticlesByAuthor(
    authorIds: string[], 
    page: number, 
    limit: number, 
    sortBy?: string, 
    query?: string
): Promise<{ articles: Article[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const searchStage = query
        ? [{ $match: { $text: { $search: query } } }]
        : [];

    let sortStage: { $sort: Record<string, 1 | -1> } = { $sort: { createdAt: -1 } };
    let addFieldsStage: { $addFields: Record<string, any> } | null = null;

    if (sortBy === 'random') {
        addFieldsStage = { $addFields: { randomSort: { $rand: {} } } };
        sortStage = { $sort: { randomSort: 1 } };
    } else if (sortBy === 'asc') {
        sortStage = { $sort: { createdAt: 1 } };
    }

    const pipeline = [
        {
            $match: {
                author: { $in: authorIds },
                isActive: true,
               isArchived: false,
            },
        },
        ...searchStage,
        ...(addFieldsStage ? [addFieldsStage] : []),
        {
            $facet: {
                data: [
                    sortStage, 
                    { $skip: skip },
                    { $limit: limit },
                ],
                count: [
                    {
                        $count: "total",
                    },
                ],
            },
        },
    ];
    const [result] = await ArticleModel.aggregate(pipeline);

    const articles = result.data || [];
    const total = result.count.length > 0 ? result.count[0].total : 0;

    return {
        articles,
        total
    };
}
}
