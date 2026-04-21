import { inject, injectable } from "inversify";
import type { IProfessionRepository } from "../../../../domain/repositories/profession.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { DisableProfessionInput } from "../dtos/disable-profession.dto";
import type { IDisableProfessionUseCase } from "./disable-profession.use-case.interface";

@injectable()
export class DisableProfessionUseCase implements IDisableProfessionUseCase {
	constructor(
		@inject(TYPES.Repositories.ProfessionRepository)
		private readonly _professionRepository: IProfessionRepository,
	) {}

	async execute(
		input: DisableProfessionInput,
	): Promise<{ resourceId: string }> {
		await this._professionRepository.disable(input.professionId);
		return { resourceId: input.professionId };
	}
}
