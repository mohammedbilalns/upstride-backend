import { inject, injectable } from "inversify";
import type { IInterestRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import type { EnableInterestInput } from "../dtos/enable-interest.dto";
import type { IEnableInterestUseCase } from "./enable-interest.usecase.interface";

@injectable()
export class EnableInterestUseCase implements IEnableInterestUseCase {
	constructor(
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
	) {}

	async execute(input: EnableInterestInput): Promise<void> {
		await this._interestRepository.enable(input.interestId);
	}
}
