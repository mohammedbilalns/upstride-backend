import { fetchSkillsFromMultipleExpertiseDto } from "../../../application/dtos";

export interface IFetchSkillsFromMulipleExpertiseUC {
	execute(
		data: fetchSkillsFromMultipleExpertiseDto,
	): Promise<{ id: string; name: string }[]>;
}
