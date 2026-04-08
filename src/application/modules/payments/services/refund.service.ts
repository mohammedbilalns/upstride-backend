import { inject, injectable } from "inversify";
import { CoinTransactionType } from "../../../../domain/entities/coin-transactions.entity";
import {
	PaymentProvider,
	PaymentStatus,
	PaymentTransaction,
} from "../../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import type { IWalletService } from "../../../services/wallet.service.interface";
import type { IRefundService, RefundParams } from "./refund.service.interface";

@injectable()
export class RefundService implements IRefundService {
	constructor(
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepo: IPlatformWalletRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async processRefund({
		bookingId,
		userId,
		refundAmount,
		refundAmountMinor,
		paymentType,
	}: RefundParams): Promise<void> {
		if (refundAmount <= 0) return;

		let refundCoins = refundAmount;
		if (paymentType === "STRIPE") {
			await this._platformSettingsService.load();
			const coinValue = this._platformSettingsService.economy.coinValue;
			if (Number.isFinite(coinValue) && coinValue > 0) {
				refundCoins = Math.round((refundAmountMinor / 100) * coinValue);
			}
		}

		await this._walletService.credit(
			userId,
			refundCoins,
			CoinTransactionType.Refund,
			"session_booking",
			bookingId,
		);

		if (refundAmountMinor > 0) {
			const providerPaymentId = `refund_${bookingId}`;
			const existing =
				await this._paymentTransactionRepository.findByProviderPaymentIdAndOwner(
					providerPaymentId,
					"platform",
				);

			if (!existing) {
				await this._paymentTransactionRepository.create(
					new PaymentTransaction(
						this._idGenerator.generate(),
						userId,
						paymentType === "STRIPE"
							? PaymentProvider.Stripe
							: PaymentProvider.Internal,
						providerPaymentId,
						-refundAmountMinor,
						"inr",
						PaymentStatus.Refunded,
						0,
						"session",
						paymentType === "STRIPE" ? "STRIPE" : "COINS",
						undefined,
						"platform",
					),
				);
			}

			await this._platformWalletRepo.incrementBalance(-refundAmountMinor);
		}
	}
}
