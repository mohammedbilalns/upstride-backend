import type { Model } from "mongoose";

export abstract class AbstractMongoRepository<TDomain, TDocument> {
	constructor(protected readonly model: Model<TDocument>) {}

	protected abstract toDomain(doc: TDocument): TDomain;
	protected abstract toDocument(entity: TDomain): Partial<TDocument>;

	protected async createDocument(entity: TDomain): Promise<TDomain> {
		const doc = this.toDocument(entity);
		const created = await this.model.create(doc);
		return this.toDomain(created.toObject());
	}

	protected async findByIdDocument(id: string): Promise<TDomain | null> {
		const doc = await this.model.findById(id).lean();
		return doc ? this.toDomain(doc as TDocument) : null;
	}

	protected buildPaginatedResult<T = TDomain>(
		items: T[],
		total: number,
		page: number,
		limit: number,
	) {
		return {
			items,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}
