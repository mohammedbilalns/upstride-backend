import { Mentor } from "../../../domain/entities";
import { IMentorRepository } from "../../../domain/repositories";
import { IFindMentorByExpertiseandSkillUC } from "../../../domain/useCases/mentorManagement/findMentorByExpertiseandSkill.uc.interface";
import { findByExpertiseandSkillDto } from "../../dtos";

export class FindMentorByExpertiseandSkillUC
	implements IFindMentorByExpertiseandSkillUC
{
	constructor(private _mentorRepository: IMentorRepository) {}

	async execute(
		dto: findByExpertiseandSkillDto,
	): Promise<{ mentors: Mentor[]; total: number }> {
		const { page, limit, query, expertiseId, skillId, userId } = dto;
		const mentors = await this._mentorRepository.findByExpertiseandSkill(
			page,
			limit,
			userId,
			expertiseId,
			skillId,
			query,
		);

		return mentors;
	}
}
