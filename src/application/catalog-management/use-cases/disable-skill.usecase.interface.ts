import type { DisableSkillInput } from "../dtos/disable-skill.dto";

export interface IDisableSkillUseCase {
	execute(input: DisableSkillInput): Promise<void>;
}
