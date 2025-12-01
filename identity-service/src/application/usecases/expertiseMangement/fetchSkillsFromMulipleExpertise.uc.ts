import { ISkillRepository } from "../../../domain/repositories";
import { IFetchSkillsFromMulipleExpertiseUC } from "../../../domain/useCases/expertiseMangement/fetchSkillsFromMulipleExpertise.uc.interface";
import { fetchSkillsFromMultipleExpertiseDto } from "../../dtos";

export class FetchSkillsFromMulipleExpertiseUC
	implements IFetchSkillsFromMulipleExpertiseUC
{
	constructor(private _skillRepository: ISkillRepository) {}

	async execute(
		data: fetchSkillsFromMultipleExpertiseDto,
	): Promise<Array<{ id: string; name: string }>> {
		const skills = [];
		for (const expertise of data.expertise) {
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
