import { ISkillRepository } from "../../../domain/repositories";
import { IFetchSkillsFromMulipleExpertiseUC } from "../../../domain/useCases/expertiseMangement/fetch-skills-from-multiple-expertise.uc.interface";
import { fetchSkillsFromMultipleExpertiseDto } from "../../dtos";

export class FetchSkillsFromMulipleExpertiseUC
	implements IFetchSkillsFromMulipleExpertiseUC
{
	constructor(private _skillRepository: ISkillRepository) {}

	async execute(
		dto: fetchSkillsFromMultipleExpertiseDto,
	): Promise<Array<{ id: string; name: string }>> {
		const skills = [];
		for (const expertise of dto.expertise) {
			const skillsFromExpertise =
				await this._skillRepository.findAll(expertise);
			skills.push(...skillsFromExpertise);
		}
		const mapped = skills.map((skill) => ({
			id: skill.id,
			name: skill.name,
		}));

		return mapped;
	}
}
