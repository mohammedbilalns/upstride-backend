import { createSkillDto } from "../../../application/dtos";

export interface ICreateSkillUC {
	execute(data: createSkillDto): Promise<void>;
}
