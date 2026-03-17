import type { AddSkillInput } from "../dtos/add-skill.dto";

export interface IAddSkillUseCase {
	execute(input: AddSkillInput): Promise<void>;
}
