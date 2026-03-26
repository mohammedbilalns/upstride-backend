import { injectable } from "inversify";
import { type QueryFilter, Types } from "mongoose";
import type { Article } from "../../../../domain/entities/article.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type {
	ArticleQuery,
	IArticleRepository,
} from "../../../../domain/repositories/article.repository.interface";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import { ArticleMapper } from "../mappers/article.mapper";
import { type ArticleDocument, ArticleModel } from "../models/article.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoArticleRepository
	extends AbstractMongoRepository<Article, ArticleDocument>
	implements IArticleRepository
{
	constructor() {
		super(ArticleModel);
	}

	protected toDomain(doc: ArticleDocument): Article {
		return ArticleMapper.toDomain(doc);
	}

	protected toDocument(entity: Article): Partial<ArticleDocument> {
		return ArticleMapper.toDocument(entity);
	}

	async create(article: Article): Promise<Article> {
		return this.createDocument(article);
	}

	async findById(id: string): Promise<Article | null> {
		return this.findByIdDocument(id);
	}

	async findBySlug(slug: string): Promise<Article | null> {
		const doc = await this.model.findOne({ slug }).lean();
		return doc ? this.toDomain(doc as ArticleDocument) : null;
	}

	async updateAuthorSnapshotByAuthorId(
		authorId: string,
		snapshot: { name?: string; avatarUrl?: string },
	): Promise<void> {
		const update: Record<string, unknown> = {};
		if (snapshot.name !== undefined) {
			update["authorSnapshot.name"] = snapshot.name;
		}
		if (snapshot.avatarUrl !== undefined) {
			update["authorSnapshot.avatarUrl"] = snapshot.avatarUrl;
		}
		if (Object.keys(update).length === 0) {
			return;
		}

		await this.model.updateMany(
			{ authorId: new Types.ObjectId(authorId) },
			{ $set: update },
		);
	}

	async getTopTags(
		limit: number = 10,
		excludeAuthorId?: string,
	): Promise<{ tag: string; count: number }[]> {
		const match: any = { isActive: true, isArchived: false };
		if (excludeAuthorId) {
			match.authorId = { $ne: new Types.ObjectId(excludeAuthorId) };
		}

		const results = await this.model
			.aggregate<{ tag: string; count: number }>([
				{ $match: match },
				{ $unwind: "$tags" },
				{ $group: { _id: "$tags", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: limit },
				{ $project: { _id: 0, tag: "$_id", count: 1 } },
			])
			.exec();

		return results;
	}

	async updateById(
		id: string,
		update: Partial<Article>,
	): Promise<Article | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();
		return doc ? this.toDomain(doc as ArticleDocument) : null;
	}

	async query({ query, sort }: QueryParams<ArticleQuery>): Promise<Article[]> {
		const filter = this._buildFilter(query);
		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();
		return docs.map((doc) => this.toDomain(doc as ArticleDocument));
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<ArticleQuery>): Promise<PaginatedResult<Article>> {
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

		const items = docs.map((doc) => this.toDomain(doc as ArticleDocument));
		return this.buildPaginatedResult(items, total, page, limit);
	}

	private _buildFilter(query?: ArticleQuery): QueryFilter<ArticleDocument> {
		const filter: QueryFilter<ArticleDocument> = {};

		if (!query) return filter;

		Object.assign(filter, {
			...(query.authorId && {
				authorId: Array.isArray(query.authorId)
					? { $in: query.authorId.map((id) => new Types.ObjectId(id)) }
					: new Types.ObjectId(query.authorId),
			}),
			...(query.isActive !== undefined && { isActive: query.isActive }),
			...(query.isArchived !== undefined && { isArchived: query.isArchived }),
			...(query.ids && {
				_id: { $in: query.ids.map((id) => new Types.ObjectId(id)) },
			}),
		});

		if (query.excludeAuthorId) {
			const excludeId = new Types.ObjectId(query.excludeAuthorId);
			const currentAuthorFilter = filter.authorId;

			if (currentAuthorFilter) {
				if (
					typeof currentAuthorFilter === "object" &&
					currentAuthorFilter !== null &&
					!(currentAuthorFilter instanceof Types.ObjectId)
				) {
					filter.authorId = { ...currentAuthorFilter, $ne: excludeId };
				} else {
					filter.authorId = { $eq: currentAuthorFilter, $ne: excludeId };
				}
			} else {
				filter.authorId = { $ne: excludeId };
			}
		}

		if (query.tags) {
			filter.tags = Array.isArray(query.tags)
				? { $in: query.tags }
				: query.tags;
		}

		if (query.title) {
			filter.title = { $regex: query.title, $options: "i" };
		}
		if (query.slug) {
			filter.slug = query.slug;
		}

		return filter;
	}
}
