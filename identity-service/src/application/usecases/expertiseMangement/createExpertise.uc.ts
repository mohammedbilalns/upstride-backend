import {
	IExpertiseRepository,
	ISkillRepository,
} from "../../../domain/repositories";
import { ICreateExpertiseUC } from "../../../domain/useCases/expertiseMangement/createExpertise.uc.interface";
import { createExpertiseDto } from "../../dtos";

export class CreateExpertiseUC implements ICreateExpertiseUC {
	constructor(
		private _expertiseRepository: IExpertiseRepository,
		private _skillRepository: ISkillRepository,
	) {}

	async execute(data: createExpertiseDto): Promise<void> {
		const expertise = await this._expertiseRepository.create({
			name: data.name,
			description: data.description,
			isVerified: true,
		});

		await Promise.all(
			data.skills.map((skill) =>
				this._skillRepository.create({
					name: skill,
					expertiseId: expertise.id,
					isVerified: true,
				}),
			),
		);
	}
}
