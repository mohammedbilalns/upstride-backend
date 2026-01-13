import { IMentorRepository } from "../../../domain/repositories";
import { IFindActiveExpertisesAndSkillsUC } from "../../../domain/useCases/expertiseMangement/find-active-expertises-and-skills.uc.interface";

export class FindActiveExpertisesAndSkillsUC
	implements IFindActiveExpertisesAndSkillsUC
{
	constructor(private _mentorRepository: IMentorRepository) {}

	async execute(): Promise<{ expertises: string[]; skills: string[] }> {
		return this._mentorRepository.findActiveExpertisesAndSkills();
	}
}
