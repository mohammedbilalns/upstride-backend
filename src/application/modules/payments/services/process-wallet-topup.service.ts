import { inject, injectable } from "inversify";
import { CoinTransactionType } from "../../../../domain/entities/coin-transactions.entity";
import { PaymentStatus } from "../../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { IWalletService } from "../../../services/wallet.service.interface";
import type {
	IProcessWalletTopupService,
	ProcessWalletTopupParams,
} from "./process-wallet-topup.service.interface";
import type { IUpsertPaymentTransactionService } from "./upsert-payment-transaction.service.interface";

@injectable()
export class ProcessWalletTopupService implements IProcessWalletTopupService {
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepository: IPlatformWalletRepository,
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Services.UpsertPaymentTransactionService)
		private readonly _upsertPaymentTransactionService: IUpsertPaymentTransactionService,
	) {}

	async process({
		userId,
		coins,
		currency,
		amountMinor,
		sessionId,
		provider,
	}: ProcessWalletTopupParams): Promise<void> {
		if (!userId || !Number.isFinite(coins) || coins <= 0) {
			logger.warn({ sessionId }, "Invalid checkout metadata — skipping");
			return;
		}

		const [existingUser, existingPlatform] = await Promise.all([
			this._paymentTransactionRepository.findByProviderPaymentIdAndOwner(
				sessionId,
				"user",
			),
			this._paymentTransactionRepository.findByProviderPaymentIdAndOwner(
				sessionId,
				"platform",
			),
		]);

		if (
			existingUser?.status === PaymentStatus.Completed &&
			existingPlatform?.status === PaymentStatus.Completed
		) {
			return;
		}

		await Promise.all([
			this._upsertPaymentTransactionService.upsert({
				existing: existingUser,
				userId,
				provider,
				sessionId,
				amountMinor,
				currency,
				coins,
				purpose: "coins",
				owner: "user",
			}),
			this._upsertPaymentTransactionService.upsert({
				existing: existingPlatform,
				userId,
				provider,
				sessionId,
				amountMinor,
				currency,
				coins,
				purpose: "coins",
				owner: "platform",
			}),
		]);

		if (Number.isFinite(amountMinor) && amountMinor > 0) {
			await this._platformWalletRepository.incrementBalance(amountMinor);
		}

		await this._walletService.credit(
			userId,
			coins,
			CoinTransactionType.Purchase,
			provider,
			sessionId,
		);
	}
}
