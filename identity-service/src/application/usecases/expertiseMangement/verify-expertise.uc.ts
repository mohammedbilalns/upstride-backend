import {
	IExpertiseRepository,
	ISkillRepository,
} from "../../../domain/repositories";
import { IVerifyExpertiseUC } from "../../../domain/useCases/expertiseMangement/verify-expertise.uc.interface";

export class VerifyExpertiseUC implements IVerifyExpertiseUC {
	constructor(
		private _expertiseRepository: IExpertiseRepository,
		private _skillRepository: ISkillRepository,
	) {}

	async execute(expertiseId: string): Promise<void> {
		await this._expertiseRepository.update(expertiseId, { isVerified: true });

		const skills = await this._skillRepository.findAll(expertiseId);
		await Promise.all(
			skills.map((skill) =>
				this._skillRepository.update(skill.id, { isVerified: true }),
			),
		);
	}
}
