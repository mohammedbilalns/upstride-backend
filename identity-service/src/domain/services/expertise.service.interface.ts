import {
	createExpertiseDto,
	updateExpertiseDto,
	createSkillDto,
	updateSkillDto,
	fetchExpertiseDto,
	fetchSkillsDto,	
	fetchSkillsFromMultipleExpertiseDto,
    FetchSkillsResponse,
    FetchExpertisesResponse
} from "../../application/dtos";

export interface IExpertiseService {
	createExpertise(data: createExpertiseDto): Promise<void>;
	updateExpertise(data: updateExpertiseDto): Promise<void>;
	fetchExpertises(data: fetchExpertiseDto): Promise<FetchExpertisesResponse>;
	verifyExpertise(expertiseId: string): Promise<void>;
	createSkill(data: createSkillDto): Promise<void>;
	updateSkill(data: updateSkillDto): Promise<void>;
	fetchSkills(data: fetchSkillsDto): Promise<FetchSkillsResponse>;
	fetchSkillsFromMulipleExpertise(data: fetchSkillsFromMultipleExpertiseDto): Promise<any>;
}
