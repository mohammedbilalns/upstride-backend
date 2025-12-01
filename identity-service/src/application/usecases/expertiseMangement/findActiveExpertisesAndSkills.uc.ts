import { IMentorRepository } from "../../../domain/repositories";
import { IFindActiveExpertisesAndSkillsUC } from "../../../domain/useCases/expertiseMangement/findActiveExpertisesAndSkills.uc.interface";

export class FindActiveExpertisesAndSkillsUC
	implements IFindActiveExpertisesAndSkillsUC
{
	constructor(private _mentorRepository: IMentorRepository) {}

	async execute(): Promise<{ expertises: string[]; skills: string[] }> {
		return this._mentorRepository.findActiveExpertisesAndSkills();
	}
}
