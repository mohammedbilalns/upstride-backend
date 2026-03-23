import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import type { UserRegisteredEvent } from "../../../domain/events/user-registered.event";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import type { IWalletService } from "../../services/wallet.service.interface";

export class SignupRewardHandler {
	constructor(
		private walletService: IWalletService,
		private platformSettings: PlatformSettingsService,
	) {}

	async handle(event: UserRegisteredEvent) {
		const rewardAmount = this.platformSettings.economy.userJoinRewardCoinCount;

		await this.walletService.credit(
			event.userId,
			rewardAmount,
			CoinTransactionType.SignupBonus,
		);
	}
}
