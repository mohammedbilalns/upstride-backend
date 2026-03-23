import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { UserNotFoundError } from "../../authentication/errors";
import type {
	GetCoinBalanceInput,
	GetCoinBalanceOutput,
} from "../dtos/get-coin-balance.dto";
import type { IGetCoinBalanceUseCase } from "./get-coin-balance.usecase.interface";

@injectable()
export class GetCoinBalanceUseCase implements IGetCoinBalanceUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute(input: GetCoinBalanceInput): Promise<GetCoinBalanceOutput> {
		const user = await this._userRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		await this._platformSettingsService.load();

		return {
			coinBalance: user.coinBalance,
			coinValue: this._platformSettingsService.economy.coinValue,
		};
	}
}
