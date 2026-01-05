import { createSkillDto } from "../../../application/dtos";

export interface ICreateSkillUC {
	execute(dto: createSkillDto): Promise<void>;
}
