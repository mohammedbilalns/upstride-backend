import { inject, injectable } from "inversify";
import type { IProfessionRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { toTitleCase } from "../../../../shared/utilities/to-title-case.util";
import type { UpdateProfessionInput } from "../dtos/update-catalog.dto";
import type { IUpdateProfessionUseCase } from "./update-profession.use-case.interface";

@injectable()
export class UpdateProfessionUseCase implements IUpdateProfessionUseCase {
	constructor(
		@inject(TYPES.Repositories.ProfessionRepository)
		private readonly _professionRepository: IProfessionRepository,
	) {}
	async execute(input: UpdateProfessionInput): Promise<void> {
		await this._professionRepository.updateById(input.professionId, {
			name: toTitleCase(input.name),
		});
	}
}
