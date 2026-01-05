import { ISkillRepository } from "../../../domain/repositories";
import { IUpdateSkillUC } from "../../../domain/useCases/expertiseMangement/updateSkill.uc.interface";
import { updateSkillDto } from "../../dtos";

export class UpdateSkillUC implements IUpdateSkillUC {
	constructor(private _skillRepository: ISkillRepository) {}

	async execute(dto: updateSkillDto): Promise<void> {
		const updateData: Partial<Omit<updateSkillDto, "skillId">> = {};
		if (dto.name) updateData.name = dto.name;
		if (dto.isVerified) updateData.isVerified = dto.isVerified;
		await this._skillRepository.update(dto.skillId, updateData);
	}
}
