import { updateSkillDto } from "../../../application/dtos";

export interface IUpdateSkillUC {
	execute(data: updateSkillDto): Promise<void>;
}
