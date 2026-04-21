import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { COIN_VALUE } from "../../../../shared/constants";
import { TYPES } from "../../../../shared/types/types";
import { UserNotFoundError } from "../../authentication/errors";
import type {
	GetCoinBalanceInput,
	GetCoinBalanceOutput,
} from "../dtos/get-coin-balance.dto";
import type { IGetCoinBalanceUseCase } from "./get-coin-balance.use-case.interface";

@injectable()
export class GetCoinBalanceUseCase implements IGetCoinBalanceUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	async execute(input: GetCoinBalanceInput): Promise<GetCoinBalanceOutput> {
		const user = await this._userRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		return {
			coinBalance: user.coinBalance,
			coinValue: COIN_VALUE,
		};
	}
}
