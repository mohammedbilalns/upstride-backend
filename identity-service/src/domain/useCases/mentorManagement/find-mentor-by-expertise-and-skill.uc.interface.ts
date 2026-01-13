import { findByExpertiseandSkillDto } from "../../../application/dtos";
import { Mentor } from "../../entities";

export interface IFindMentorByExpertiseandSkillUC {
	execute(
		dto: findByExpertiseandSkillDto,
	): Promise<{ mentors: Mentor[]; total: number }>;
}
