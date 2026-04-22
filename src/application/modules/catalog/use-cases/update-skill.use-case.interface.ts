import type { UpdateSkillInput } from "../dtos/update-catalog.dto";

export interface IUpdateSkillUseCase {
	execute(input: UpdateSkillInput): Promise<void>;
}
