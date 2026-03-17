import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import Stripe from "stripe";
import {
	PaymentProvider,
	PaymentStatus,
	PaymentTransaction,
} from "../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../domain/repositories/payment-transactions.repository.interface";
import env from "../../../shared/config/env";
import { TYPES } from "../../../shared/types/types";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import type {
	CreateCheckoutSessionInput,
	CreateCheckoutSessionOutput,
} from "../dtos/create-checkout-session.dto";
import type { ICreateCheckoutSessionUseCase } from "./create-checkout-session.usecase.interface";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

@injectable()
export class CreateCheckoutSessionUseCase
	implements ICreateCheckoutSessionUseCase
{
	constructor(
		@inject(TYPES.Services.PlatformSettings)
		private readonly platformSettingsService: PlatformSettingsService,
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly paymentTransactionRepository: IPaymentTransactionRepository,
	) {}

	async execute(
		input: CreateCheckoutSessionInput,
	): Promise<CreateCheckoutSessionOutput> {
		await this.platformSettingsService.load();
		const coinValue = this.platformSettingsService.economy.coinValue;

		const amountInCurrency = input.coins / coinValue;
		const amountInMinor = Math.round(amountInCurrency * 100);

		if (amountInMinor <= 0) {
			throw new Error("Invalid purchase amount");
		}

		const successUrl =
			env.STRIPE_SUCCESS_URL ??
			`${env.CLIENT_URL}/wallet?status=success&session_id={CHECKOUT_SESSION_ID}`;
		const cancelUrl =
			env.STRIPE_CANCEL_URL ?? `${env.CLIENT_URL}/wallet?status=cancel`;

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "inr",
						product_data: {
							name: "Coins",
							description: `${input.coins} coins`,
						},
						unit_amount: amountInMinor,
					},
					quantity: 1,
				},
			],
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata: {
				userId: input.userId,
				coins: String(input.coins),
				coinValue: String(coinValue),
			},
		});

		const transaction = new PaymentTransaction(
			randomUUID(),
			input.userId,
			PaymentProvider.Stripe,
			session.id,
			amountInMinor,
			"inr",
			PaymentStatus.Pending,
			input.coins,
		);

		await this.paymentTransactionRepository.create(transaction);

		return {
			sessionId: session.id,
			url: session.url ?? null,
			amount: amountInMinor,
			currency: "inr",
			coins: input.coins,
		};
	}
}
