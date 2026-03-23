import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import type { UserRegisteredEvent } from "../../../domain/events/user-registered.event";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import type { IWalletService } from "../../services/wallet.service.interface";

export class SignupRewardHandler {
	constructor(
		private _walletService: IWalletService,
		private _platformSettings: PlatformSettingsService,
	) {}

	async handle(event: UserRegisteredEvent) {
		const rewardAmount = this._platformSettings.economy.userJoinRewardCoinCount;

		await this._walletService.credit(
			event.userId,
			rewardAmount,
			CoinTransactionType.SignupBonus,
		);
	}
}
