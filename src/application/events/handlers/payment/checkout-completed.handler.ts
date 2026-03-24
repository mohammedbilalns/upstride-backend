import { inject, injectable } from "inversify";
import { CoinTransactionType } from "../../../../domain/entities/coin-transactions.entity";
import {
	PaymentStatus,
	PaymentTransaction,
} from "../../../../domain/entities/payment-transactions.entity";
import type { CheckoutCompletedEvent } from "../../../../domain/events/checkout-completed.event";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { PaymentWebhookEvent } from "../../../services/payment-webhook.parser.interface";
import type { IWalletService } from "../../../services/wallet.service.interface";

@injectable()
export class CheckoutCompletedHandler {
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async handleEvent({ payload: event }: CheckoutCompletedEvent): Promise<void> {
		const { userId, coins, currency, amountMinor, sessionId, provider } = event;

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

		// Idempotency guard
		if (
			existingUser?.status === PaymentStatus.Completed &&
			existingPlatform?.status === PaymentStatus.Completed
		) {
			return;
		}

		await Promise.all([
			this._upsertTransaction(
				existingUser,
				userId,
				provider,
				sessionId,
				amountMinor,
				currency,
				coins,
				"user",
			),
			this._upsertTransaction(
				existingPlatform,
				userId,
				provider,
				sessionId,
				amountMinor,
				currency,
				coins,
				"platform",
			),
		]);

		await this._walletService.credit(
			userId,
			coins,
			CoinTransactionType.Purchase,
			provider,
			sessionId,
		);
	}

	private async _upsertTransaction(
		existing: PaymentTransaction | null | undefined,
		userId: string,
		provider: PaymentWebhookEvent["provider"],
		sessionId: string,
		amountMinor: number,
		currency: string,
		coins: number,
		owner: "user" | "platform",
	): Promise<void> {
		if (!existing) {
			await this._paymentTransactionRepository.create(
				new PaymentTransaction(
					this._idGenerator.generate(),
					userId,
					provider,
					sessionId,
					amountMinor,
					currency,
					PaymentStatus.Completed,
					coins,
					undefined,
					owner,
				),
			);
		} else if (existing.status !== PaymentStatus.Completed) {
			await this._paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
				sessionId,
				PaymentStatus.Completed,
				owner,
			);
		}
	}
}
