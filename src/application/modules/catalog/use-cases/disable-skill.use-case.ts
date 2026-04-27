import { inject, injectable } from "inversify";
import type { ISkillRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { DisableSkillInput } from "../dtos/disable-skill.dto";
import type { IDisableSkillUseCase } from "./disable-skill.use-case.interface";

@injectable()
export class DisableSkillUseCase implements IDisableSkillUseCase {
	constructor(
		@inject(TYPES.Repositories.SkillRepository)
		private readonly _skillRepository: ISkillRepository,
	) {}

	async execute(input: DisableSkillInput): Promise<{ resourceId: string }> {
		await this._skillRepository.disable(input.skillId);
		return { resourceId: input.skillId };
	}
}
