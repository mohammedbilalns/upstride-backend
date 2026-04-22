import type { DisableSkillInput } from "../dtos/disable-skill.dto";

export interface DisableSkillOutput {
	resourceId: string;
}

export interface IDisableSkillUseCase {
	execute(input: DisableSkillInput): Promise<DisableSkillOutput>;
}
