import type {
	UpdateSkillInput,
	UpdateSkillOutput,
} from "../dtos/update-catalog.dto";

export interface IUpdateSkillUseCase {
	execute(input: UpdateSkillInput): Promise<UpdateSkillOutput>;
}
