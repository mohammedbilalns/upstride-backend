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

	async execute(dto: createExpertiseDto): Promise<void> {
		const expertise = await this._expertiseRepository.create({
			name: dto.name,
			description: dto.description,
			isVerified: true,
		});

		await Promise.all(
			dto.skills.map((skill) =>
				this._skillRepository.create({
					name: skill,
					expertiseId: expertise.id,
					isVerified: true,
				}),
			),
		);
	}
}
