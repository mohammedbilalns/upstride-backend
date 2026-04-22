import type { AddSkillInput, AddSkillOutput } from "../dtos/add-skill.dto";

export interface IAddSkillUseCase {
	execute(input: AddSkillInput): Promise<AddSkillOutput>;
}
