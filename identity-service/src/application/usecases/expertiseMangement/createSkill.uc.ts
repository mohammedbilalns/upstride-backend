import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { UserRole } from "../../../common/enums/userRoles";
import { ISkillRepository } from "../../../domain/repositories";
import { ICreateSkillUC } from "../../../domain/useCases/expertiseMangement/createSkill.uc.interface";
import { createSkillDto } from "../../dtos";
import { AppError } from "../../errors/AppError";

export class CreateSkillUC implements ICreateSkillUC {
	constructor(private _skillRepository: ISkillRepository) {}

	async execute(data: createSkillDto): Promise<void> {
		const isExists = await this._skillRepository.exists(
			data.name,
			data.expertiseId,
		);
		if (isExists)
			throw new AppError(
				ErrorMessage.SKILL_ALREADY_EXISTS,
				HttpStatus.CONFLICT,
			);

		const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(
			data.userRole,
		);
		await this._skillRepository.create({
			name: data.name,
			expertiseId: data.expertiseId,
			isVerified: isAdmin,
		});
	}
}
