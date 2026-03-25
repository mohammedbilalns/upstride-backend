import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { ArticleView } from "../../../../domain/entities/article-view.entity";
import type {
	ArticleViewQuery,
	IArticleViewRepository,
} from "../../../../domain/repositories/article-view.repository.interface";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import { ArticleViewMapper } from "../mappers/article-view.mapper";
import {
	type ArticleViewDocument,
	ArticleViewModel,
} from "../models/article-view.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoArticleViewRepository
	extends AbstractMongoRepository<ArticleView, ArticleViewDocument>
	implements IArticleViewRepository
{
	constructor() {
		super(ArticleViewModel);
	}

	protected toDomain(doc: ArticleViewDocument): ArticleView {
		return ArticleViewMapper.toDomain(doc);
	}

	protected toDocument(entity: ArticleView): Partial<ArticleViewDocument> {
		return ArticleViewMapper.toDocument(entity);
	}

	async create(view: ArticleView): Promise<ArticleView> {
		return this.createDocument(view);
	}

	async findById(id: string): Promise<ArticleView | null> {
		return this.findByIdDocument(id);
	}

	async query({
		query,
		sort,
	}: QueryParams<ArticleViewQuery>): Promise<ArticleView[]> {
		const filter = this._buildFilter(query);
		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();
		return docs.map((doc) => this.toDomain(doc as ArticleViewDocument));
	}

	private _buildFilter(
		query?: ArticleViewQuery,
	): QueryFilter<ArticleViewDocument> {
		const filter: QueryFilter<ArticleViewDocument> = {};

		if (!query) return filter;

		Object.assign(filter, {
			...(query.articleId && { articleId: query.articleId }),
			...(query.userId && { userId: query.userId }),
		});

		return filter;
	}
}
