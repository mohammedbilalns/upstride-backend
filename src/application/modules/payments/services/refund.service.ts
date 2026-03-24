import { inject, injectable } from "inversify";
import {
	CoinTransaction,
	CoinTransactionType,
} from "../../../../domain/entities/coin-transactions.entity";
import type { ICoinTransactionRepository } from "../../../../domain/repositories/coin-transactions.repository.interface";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { IWalletService } from "../../../services/wallet.service.interface";
import type { IRefundService, RefundParams } from "./refund.service.interface";

@injectable()
export class RefundService implements IRefundService {
	constructor(
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Repositories.CoinTransactionRepository)
		private readonly _coinTxRepo: ICoinTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepo: IPlatformWalletRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async processRefund({
		bookingId,
		userId,
		refundAmount,
	}: RefundParams): Promise<void> {
		if (refundAmount <= 0) return;

		await this._walletService.credit(
			userId,
			refundAmount,
			CoinTransactionType.Refund,
			"session_booking",
			bookingId,
		);

		await this._coinTxRepo.create(
			new CoinTransaction(
				this._idGenerator.generate(),
				userId,
				-refundAmount,
				CoinTransactionType.Refund,
				"session_booking",
				bookingId,
				undefined,
				"platform",
			),
		);

		await this._platformWalletRepo.incrementBalance(-refundAmount);
	}
}
