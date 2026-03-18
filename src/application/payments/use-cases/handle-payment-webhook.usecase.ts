import { inject, injectable } from "inversify";
import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import {
	PaymentProvider,
	PaymentStatus,
	PaymentTransaction,
} from "../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../domain/repositories/payment-transactions.repository.interface";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import type { IPaymentWebhookParser } from "../../services/payment-webhook.parser.interface";
import type { IWalletService } from "../../services/wallet.service.interface";
import type { HandlePaymentWebhookInput } from "../dtos/handle-payment-webhook.dto";
import type { IHandlePaymentWebhookUseCase } from "./handle-payment-webhook.usecase.interface";

@injectable()
export class HandlePaymentWebhookUseCase
	implements IHandlePaymentWebhookUseCase
{
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Services.WalletService)
		private readonly walletService: IWalletService,
		@inject(TYPES.Services.PaymentWebhookParser)
		private readonly paymentWebhookParser: IPaymentWebhookParser,
		@inject(TYPES.Services.IdGenerator)
		private readonly idGenerator: IIdGenerator,
	) {}

	async execute(input: HandlePaymentWebhookInput): Promise<void> {
		const event = await this.paymentWebhookParser.parse(input);
		if (!event) {
			return;
		}

		switch (event.type) {
			case "checkout.session.completed": {
				const userId = event.userId;
				const coins = event.coins;
				const currency = event.currency;

				if (!userId || !Number.isFinite(coins) || coins <= 0) {
					logger.warn(
						{ sessionId: event.sessionId },
						"Invalid checkout metadata",
					);
					return;
				}

				const existingUser =
					await this.paymentTransactionRepository.findByProviderPaymentIdAndOwner(
						event.sessionId,
						"user",
					);
				const existingPlatform =
					await this.paymentTransactionRepository.findByProviderPaymentIdAndOwner(
						event.sessionId,
						"platform",
					);

				if (
					existingUser?.status === PaymentStatus.Completed &&
					existingPlatform?.status === PaymentStatus.Completed
				) {
					return;
				}

				const amountInMinor = event.amountMinor;
				if (!existingUser) {
					const userTransaction = new PaymentTransaction(
						this.idGenerator.generate(),
						userId,
						PaymentProvider.Stripe,
						event.sessionId,
						amountInMinor,
						currency,
						PaymentStatus.Completed,
						coins,
						undefined,
						"user",
					);
					await this.paymentTransactionRepository.create(userTransaction);
				} else if (existingUser.status !== PaymentStatus.Completed) {
					await this.paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
						event.sessionId,
						PaymentStatus.Completed,
						"user",
					);
				}

				if (!existingPlatform) {
					const platformTransaction = new PaymentTransaction(
						this.idGenerator.generate(),
						userId,
						PaymentProvider.Stripe,
						event.sessionId,
						amountInMinor,
						currency,
						PaymentStatus.Completed,
						coins,
						undefined,
						"platform",
					);
					await this.paymentTransactionRepository.create(platformTransaction);
				} else if (existingPlatform.status !== PaymentStatus.Completed) {
					await this.paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
						event.sessionId,
						PaymentStatus.Completed,
						"platform",
					);
				}

				await this.paymentTransactionRepository.updateStatusByProviderPaymentId(
					event.sessionId,
					PaymentStatus.Completed,
				);

				await this.walletService.credit(
					userId,
					coins,
					CoinTransactionType.Purchase,
					PaymentProvider.Stripe,
					event.sessionId,
				);
				return;
			}
			case "checkout.session.expired":
			case "checkout.session.async_payment_failed": {
				await this.paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
					event.sessionId,
					PaymentStatus.Failed,
					"user",
				);
				await this.paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
					event.sessionId,
					PaymentStatus.Failed,
					"platform",
				);
				await this.paymentTransactionRepository.updateStatusByProviderPaymentId(
					event.sessionId,
					PaymentStatus.Failed,
				);
				return;
			}
			default:
				return;
		}
	}
}
