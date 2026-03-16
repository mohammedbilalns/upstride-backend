import type { EnableSkillInput } from "../dtos/enable-skill.dto";

export interface IEnableSkillUseCase {
	execute(input: EnableSkillInput): Promise<void>;
}
