import { Mentor } from "../../../domain/entities/mentor.entity";
import { mentorModel, IMentor } from "../models/mentor.model";
import { BaseRepository } from "./base.repository";
import { IMentorRepository } from "../../../domain/repositories";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

export class MentorRepository
extends BaseRepository<Mentor, IMentor>
implements IMentorRepository
{
	constructor() {
		super(mentorModel);
	}

	private createSearchCondition(query?: string) {
		if (!query) return {};

		return {
			$or: [
				{ bio: { $regex: query, $options: 'i' } },
				{ currentRole: { $regex: query, $options: 'i' } },
				{ institution: { $regex: query, $options: 'i' } },
				{ educationalQualifications: { $regex: query, $options: 'i' } },
				{ personalWebsite: { $regex: query, $options: 'i' } }
			]
		};
	}

	protected mapToDomain(doc: IMentor): Mentor {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			userId: mapped.userId,
			bio: mapped.bio,
			currentRole: mapped.currentRole,
			institution: mapped.institution,
			yearsOfExperience: mapped.yearsOfExperience,
			educationalQualifications: mapped.educationalQualifications,
			personalWebsite: mapped.personalWebsite,
			expertiseId: mapped.expertiseId,
			skillIds: mapped.skillIds,
			resumeUrl: mapped.resumeUrl,
			termsAccepted: mapped.termsAccepted,
			isActive: mapped.isActive
		};
	}

	async findAll(page: number, limit: number, query?: string): Promise<Mentor[]> {
		const searchCondition = this.createSearchCondition(query);

		const docs = await this._model
			.find(searchCondition)
			.skip(page * limit)
			.limit(limit)
			.exec();

		const mapped = docs.map(this.mapToDomain);
		return docs ? mapped : [];
	} 

	async findByExpertiseandSkill(
		expertiseId: string, 
		skillId: string, 
		page: number, 
		limit: number,
		query?: string
	): Promise<Mentor[]> {
		const searchCondition = this.createSearchCondition(query);
		const baseCondition = { expertiseId, skillIds: skillId };

		const finalCondition = query 
			? { $and: [baseCondition, searchCondition] }
			: baseCondition;

		const docs = await this._model
			.find(finalCondition)
			.skip(page * limit)
			.limit(limit)
			.exec();

		const mapped = docs.map(this.mapToDomain);
		return docs ? mapped : [];
	}	
}
