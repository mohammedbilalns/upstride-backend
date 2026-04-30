import { inject, injectable } from "inversify";
import type { ISkillRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { toTitleCase } from "../../../../shared/utilities/to-title-case.util";
import type {
	UpdateSkillInput,
	UpdateSkillOutput,
} from "../dtos/update-catalog.dto";
import type { IUpdateSkillUseCase } from "./update-skill.use-case.interface";

@injectable()
export class UpdateSkillUseCase implements IUpdateSkillUseCase {
	constructor(
		@inject(TYPES.Repositories.SkillRepository)
		private readonly _skillRepository: ISkillRepository,
	) {}

	async execute(input: UpdateSkillInput): Promise<UpdateSkillOutput> {
		const name = toTitleCase(input.name);
		await this._skillRepository.updateById(input.skillId, {
			name,
		});

		return { updatedName: name };
	}
}
