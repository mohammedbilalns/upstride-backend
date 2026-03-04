import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Interest } from "../../../../domain/entities/interest.entity";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type {
	IInterestRepository,
	InterestQuery,
} from "../../../../domain/repositories/interest.repository.interface";
import { InterestMapper } from "../mappers/interest.mapper";
import {
	type InterestDocument,
	InterestModel,
} from "../models/interests.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoInterestRepository
	extends AbstractMongoRepository<Interest, InterestDocument>
	implements IInterestRepository
{
	constructor() {
		super(InterestModel);
	}

	protected toDomain(doc: InterestDocument): Interest {
		return InterestMapper.toDomain(doc);
	}

	protected toDocument(entity: Interest): Partial<InterestDocument> {
		return InterestMapper.toDocument(entity);
	}

	async create(interest: Interest): Promise<Interest> {
		return this.createDocument(interest);
	}

	async updateById(
		id: string,
		update: Partial<Interest>,
	): Promise<Interest | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { new: true })
			.lean();

		return doc ? this.toDomain(doc as InterestDocument) : null;
	}

	async disable(id: string): Promise<void> {
		await this.model.findByIdAndUpdate(id, { isActive: false });
	}

	async enable(id: string): Promise<void> {
		await this.model.findByIdAndUpdate(id, { isActive: true });
	}

	async query({
		query,
		sort,
	}: QueryParams<InterestQuery>): Promise<Interest[]> {
		const filter: QueryFilter<InterestDocument> = {};

		if (query?.name) {
			filter.name = { $regex: query.name, $options: "i" };
		}

		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as InterestDocument));
	}
}
