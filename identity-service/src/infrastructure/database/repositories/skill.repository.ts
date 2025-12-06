import type { Skill } from "../../../domain/entities";
import type { ISkillRepository } from "../../../domain/repositories/skill.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type ISkill, skillModel } from "../models/skill.model";
import { BaseRepository } from "./base.repository";

export class SkillRepository
	extends BaseRepository<Skill, ISkill>
	implements ISkillRepository
{
	constructor() {
		super(skillModel);
	}

	protected mapToDomain(doc: ISkill): Skill {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			name: mapped.name,
			expertiseId: mapped.expertiseId,
			isVerified: mapped.isVerified,
		};
	}

	//NOTE : unused pagination ?
	async findAll(
		expertiseId: string,
		page?: number,
		limit?: number,
		query?: string,
		isUser?: boolean,
	): Promise<Skill[]> {
		const filter: any = {};

		if (expertiseId) {
			filter.expertiseId = expertiseId;
		}
		// only fetch verified skills if isForUser is true
		if (isUser) {
			filter.isVerified = true;
		}

		if (query) {
			filter.$or = [
				{ name: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
			];
		}

		let queryBuilder = this._model
			.find(filter)
			.sort(query ? {} : { createdAt: -1 });

		if (page && limit) {
			const skip = (page - 1) * limit;
			queryBuilder = queryBuilder.skip(skip).limit(limit);
		}

		const docs = await queryBuilder.exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	async exists(name: string, expertiseId: string): Promise<boolean> {
		const doc = await this._model.findOne({
			name: { $regex: new RegExp(`^${name}$`, "i") },
			expertiseId,
		});
		return !!doc;
	}

	async count(expertiseId?: string, query?: string): Promise<number> {
		const filter: any = {};

		if (expertiseId) {
			filter.expertiseId = expertiseId;
		}

		if (query) {
			filter.$or = [{ name: { $regex: query, $options: "i" } }];
		}

		const total = await this._model.countDocuments(filter).exec();
		return total;
	}
	async createIfNotExists(skill: Skill): Promise<Skill> {
		const doc = await this._model.findOneAndUpdate(
			{ name: skill.name },
			{ $setOnInsert: skill },
			{ upsert: true, new: true },
		);

		return this.mapToDomain(doc);
	}
}
