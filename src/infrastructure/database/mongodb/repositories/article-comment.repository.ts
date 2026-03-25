import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { ArticleComment } from "../../../../domain/entities/article-comment.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type {
	ArticleCommentQuery,
	IArticleCommentRepository,
} from "../../../../domain/repositories/article-comment.repository.interface";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import { ArticleCommentMapper } from "../mappers/article-comment.mapper";
import {
	type ArticleCommentDocument,
	ArticleCommentModel,
} from "../models/article-comment.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoArticleCommentRepository
	extends AbstractMongoRepository<ArticleComment, ArticleCommentDocument>
	implements IArticleCommentRepository
{
	constructor() {
		super(ArticleCommentModel);
	}

	protected toDomain(doc: ArticleCommentDocument): ArticleComment {
		return ArticleCommentMapper.toDomain(doc);
	}

	protected toDocument(
		entity: ArticleComment,
	): Partial<ArticleCommentDocument> {
		return ArticleCommentMapper.toDocument(entity);
	}

	async create(comment: ArticleComment): Promise<ArticleComment> {
		return this.createDocument(comment);
	}

	async findById(id: string): Promise<ArticleComment | null> {
		return this.findByIdDocument(id);
	}

	async updateById(
		id: string,
		update: Partial<ArticleComment>,
	): Promise<ArticleComment | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();
		return doc ? this.toDomain(doc as ArticleCommentDocument) : null;
	}

	async query({
		query,
		sort,
	}: QueryParams<ArticleCommentQuery>): Promise<ArticleComment[]> {
		const filter = this._buildFilter(query);
		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();
		return docs.map((doc) => this.toDomain(doc as ArticleCommentDocument));
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<ArticleCommentQuery>): Promise<
		PaginatedResult<ArticleComment>
	> {
		const filter = this._buildFilter(query);
		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.model
				.find(filter)
				.sort(sort ?? { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(filter),
		]);

		const items = docs.map((doc) =>
			this.toDomain(doc as ArticleCommentDocument),
		);
		return this.buildPaginatedResult(items, total, page, limit);
	}

	private _buildFilter(
		query?: ArticleCommentQuery,
	): QueryFilter<ArticleCommentDocument> {
		const filter: QueryFilter<ArticleCommentDocument> = {};

		if (!query) return filter;

		Object.assign(filter, {
			...(query.articleId && { articleId: query.articleId }),
			...(query.userId && { userId: query.userId }),
			...(query.isActive !== undefined && { isActive: query.isActive }),
		});

		if (query.parentId !== undefined) {
			filter.parentId = query.parentId ?? null;
		}

		return filter;
	}
}
