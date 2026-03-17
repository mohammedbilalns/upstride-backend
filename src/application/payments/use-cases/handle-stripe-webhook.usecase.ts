import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import {
	PaymentProvider,
	PaymentStatus,
	PaymentTransaction,
} from "../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../domain/repositories/payment-transactions.repository.interface";
import env from "../../../shared/config/env";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import type { IWalletService } from "../../services/wallet.service.interface";
import type { HandleStripeWebhookInput } from "../dtos/handle-stripe-webhook.dto";
import type { IHandleStripeWebhookUseCase } from "./handle-stripe-webhook.usecase.interface";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Services.WalletService)
		private readonly walletService: IWalletService,
		@inject(TYPES.Services.IdGenerator)
		private readonly idGenerator: IIdGenerator,
	) {}

	async execute(input: HandleStripeWebhookInput): Promise<void> {
		const event = stripe.webhooks.constructEvent(
			input.payload,
			input.signature,
			env.STRIPE_WEBHOOK_SECRET,
		);

		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				const userId = session.metadata?.userId;
				const coins = Number(session.metadata?.coins ?? 0);
				const currency = session.currency ?? "inr";

				if (!userId || !Number.isFinite(coins) || coins <= 0) {
					logger.warn({ sessionId: session.id }, "Invalid checkout metadata");
					return;
				}

				const existing =
					await this.paymentTransactionRepository.findByProviderPaymentId(
						session.id,
					);

				if (existing?.status === PaymentStatus.Completed) {
					return;
				}

				if (!existing) {
					const amountInMinor = session.amount_total ?? 0;
					const transaction = new PaymentTransaction(
						this.idGenerator.generate(),
						userId,
						PaymentProvider.Stripe,
						session.id,
						amountInMinor,
						currency,
						PaymentStatus.Completed,
						coins,
					);
					await this.paymentTransactionRepository.create(transaction);
				} else {
					await this.paymentTransactionRepository.updateStatusByProviderPaymentId(
						session.id,
						PaymentStatus.Completed,
					);
				}

				await this.walletService.credit(
					userId,
					coins,
					CoinTransactionType.Purchase,
					PaymentProvider.Stripe,
					session.id,
				);
				return;
			}
			case "checkout.session.expired":
			case "checkout.session.async_payment_failed": {
				const session = event.data.object as Stripe.Checkout.Session;
				await this.paymentTransactionRepository.updateStatusByProviderPaymentId(
					session.id,
					PaymentStatus.Failed,
				);
				return;
			}
			default:
				return;
		}
	}
}
