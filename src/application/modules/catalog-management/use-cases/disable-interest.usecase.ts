import { inject, injectable } from "inversify";
import type { IInterestRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { DisableInterestInput } from "../dtos/disable-interest.dto";
import type { IDisableInterestUseCase } from "./disable-interest.usecase.interface";

@injectable()
export class DisableInterestUseCase implements IDisableInterestUseCase {
	constructor(
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
	) {}

	async execute(input: DisableInterestInput): Promise<void> {
		await this._interestRepository.disable(input.interestId);
	}
}
