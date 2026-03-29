import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import type {
	ArticleReactionQuery,
	IArticleReactionRepository,
} from "../../../../domain/repositories/article-reaction.repository.interface";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import { ArticleReactionMapper } from "../mappers/article-reaction.mapper";
import {
	type ArticleReactionDocument,
	ArticleReactionModel,
} from "../models/article-reaction.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoArticleReactionRepository
	extends AbstractMongoRepository<ArticleReaction, ArticleReactionDocument>
	implements IArticleReactionRepository
{
	constructor() {
		super(ArticleReactionModel);
	}

	protected toDomain(doc: ArticleReactionDocument): ArticleReaction {
		return ArticleReactionMapper.toDomain(doc);
	}

	protected toDocument(
		entity: ArticleReaction,
	): Partial<ArticleReactionDocument> {
		return ArticleReactionMapper.toDocument(entity);
	}

	async create(reaction: ArticleReaction): Promise<ArticleReaction> {
		const doc = await this.model.create(this.toDocument(reaction));
		const populated = await doc.populate("userId", "name");
		return this.toDomain(populated as any);
	}

	async findById(id: string): Promise<ArticleReaction | null> {
		return this.findByIdDocument(id);
	}

	async updateById(
		id: string,
		update: Partial<ArticleReaction>,
	): Promise<ArticleReaction | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();
		return doc ? this.toDomain(doc as ArticleReactionDocument) : null;
	}

	async query({
		query,
		sort,
	}: QueryParams<ArticleReactionQuery>): Promise<ArticleReaction[]> {
		const filter = this._buildFilter(query);
		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();
		return docs.map((doc) => this.toDomain(doc as ArticleReactionDocument));
	}

	private _buildFilter(
		query?: ArticleReactionQuery,
	): QueryFilter<ArticleReactionDocument> {
		const filter: QueryFilter<ArticleReactionDocument> = {};

		if (!query) return filter;

		Object.assign(filter, {
			...(query.resourceId && { resourceId: query.resourceId }),
			...(query.userId && { userId: query.userId }),
		});

		if (query.reactionType) {
			filter.reactionType = query.reactionType;
		}

		return filter;
	}
	async deleteById(id: string): Promise<void> {
		await this.model.findByIdAndDelete(id).exec();
	}
}
