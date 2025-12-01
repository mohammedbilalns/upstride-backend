import { ISkillRepository } from "../../../domain/repositories";
import { IUpdateSkillUC } from "../../../domain/useCases/expertiseMangement/updateSkill.uc.interface";
import { updateSkillDto } from "../../dtos";

export class UpdateSkillUC implements IUpdateSkillUC {
	constructor(private _skillRepository: ISkillRepository) {}

	async execute(data: updateSkillDto): Promise<void> {
		const updateData: Partial<Omit<updateSkillDto, "skillId">> = {};
		if (data.name) updateData.name = data.name;
		if (data.isVerified) updateData.isVerified = data.isVerified;
		await this._skillRepository.update(data.skillId, updateData);
	}
}
