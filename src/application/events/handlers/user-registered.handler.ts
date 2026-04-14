import { inject, injectable } from "inversify";
import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import type { UserRegisteredEvent } from "../../../domain/events/user-registered.event";
import { USER_JOIN_REWARD_COIN_COUNT } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import type { IWalletService } from "../../services/wallet.service.interface";
import type { EventHandler } from "../event-handler.interface";

@injectable()
export class UserRegisteredHandler
	implements EventHandler<UserRegisteredEvent>
{
	constructor(
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
	) {}

	async handle(event: UserRegisteredEvent) {
		await this._walletService.credit(
			event.payload.userId,
			USER_JOIN_REWARD_COIN_COUNT,
			CoinTransactionType.SignupBonus,
		);
	}
}
