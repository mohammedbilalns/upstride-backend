import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Profession } from "../../../../domain/entities/profession.entity";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type {
	IProfessionRepository,
	ProfessionQuery,
} from "../../../../domain/repositories/profession.repository.interface";
import { ProfessionMapper } from "../mappers/profession.mapper";
import {
	type ProfessionDocument,
	ProfessionModel,
} from "../models/profession.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoProfessionRepository
	extends AbstractMongoRepository<Profession, ProfessionDocument>
	implements IProfessionRepository
{
	constructor() {
		super(ProfessionModel);
	}

	protected toDomain(doc: ProfessionDocument): Profession {
		return ProfessionMapper.toDomain(doc);
	}

	protected toDocument(entity: Profession): Partial<ProfessionDocument> {
		return ProfessionMapper.toDocument(entity);
	}

	async create(profession: Profession): Promise<Profession> {
		return this.createDocument(profession);
	}

	async findById(id: string): Promise<Profession | null> {
		const doc = await this.model.findById(id).lean();
		return doc ? this.toDomain(doc as ProfessionDocument) : null;
	}

	async updateById(
		id: string,
		update: Partial<Profession>,
	): Promise<Profession | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as ProfessionDocument) : null;
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
	}: QueryParams<ProfessionQuery>): Promise<Profession[]> {
		const filter: QueryFilter<ProfessionDocument> = {};

		if (query?.name) {
			filter.name = { $regex: query.name, $options: "i" };
		}

		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as ProfessionDocument));
	}

	async findAllActive(): Promise<Profession[]> {
		const docs = await this.model.find({ isActive: true }).lean();
		return docs.map((doc) => this.toDomain(doc as ProfessionDocument));
	}
}
