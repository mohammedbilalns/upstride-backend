import { inject, injectable } from "inversify";
import type { IInterestRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { toTitleCase } from "../../../../shared/utilities/to-title-case.util";
import type { UpdateInterestInput } from "../dtos/update-catalog.dto";
import type { IUpdateInterestUseCase } from "./udpate-interest.use-case.interface";

@injectable()
export class UpdateInterestUseCase implements IUpdateInterestUseCase {
	constructor(
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
	) {}
	async execute(input: UpdateInterestInput): Promise<void> {
		await this._interestRepository.updateById(input.interestId, {
			name: toTitleCase(input.name),
		});
	}
}
