import { inject, injectable } from "inversify";
import type { ISkillRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { EnableSkillInput } from "../dtos/enable-skill.dto";
import type { IEnableSkillUseCase } from "./enable-skill.use-case.interface";

@injectable()
export class EnableSkillUseCase implements IEnableSkillUseCase {
	constructor(
		@inject(TYPES.Repositories.SkillRepository)
		private readonly _skillRepository: ISkillRepository,
	) {}

	async execute(input: EnableSkillInput): Promise<void> {
		await this._skillRepository.enable(input.skillId);
	}
}
