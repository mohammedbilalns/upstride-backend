import type { EnableSkillInput } from "../dtos/enable-skill.dto";

export interface EnableSkillOutput {
	resourceId: string;
}

export interface IEnableSkillUseCase {
	execute(input: EnableSkillInput): Promise<EnableSkillOutput>;
}
