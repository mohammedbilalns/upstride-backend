import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Skill } from "../../../../domain/entities/skill.entity";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type {
	ISkillRepository,
	SkillQuery,
} from "../../../../domain/repositories/skill.repository.interface";
import { SkillMapper } from "../mappers/skill.mapper";
import { type SkillDocument, SkillModel } from "../models/skill.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoSkillRepository
	extends AbstractMongoRepository<Skill, SkillDocument>
	implements ISkillRepository
{
	constructor() {
		super(SkillModel);
	}

	protected toDomain(doc: SkillDocument): Skill {
		return SkillMapper.toDomain(doc);
	}

	protected toDocument(entity: Skill): Partial<SkillDocument> {
		return SkillMapper.toDocument(entity);
	}

	async create(skill: Skill): Promise<Skill> {
		return this.createDocument(skill);
	}

	async updateById(id: string, update: Partial<Skill>): Promise<Skill | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { new: true })
			.lean();

		return doc ? this.toDomain(doc as SkillDocument) : null;
	}

	async disable(id: string): Promise<void> {
		await this.model.findByIdAndUpdate(id, { isActive: false });
	}

	async enable(id: string): Promise<void> {
		await this.model.findByIdAndUpdate(id, { isActive: true });
	}

	async query({ query, sort }: QueryParams<SkillQuery>): Promise<Skill[]> {
		const filter: QueryFilter<SkillDocument> = {};

		if (query?.name) {
			filter.name = { $regex: query.name, $options: "i" };
		}

		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as SkillDocument));
	}
}
