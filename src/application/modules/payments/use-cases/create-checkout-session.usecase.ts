import { inject, injectable } from "inversify";
import {
	PaymentProvider,
	PaymentStatus,
	PaymentTransaction,
} from "../../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import env from "../../../../shared/config/env";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { IPaymentService } from "../../../services/payment.service.interface";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import type {
	CreateCheckoutSessionInput,
	CreateCheckoutSessionOutput,
} from "../dtos/create-checkout-session.dto";
import { InvalidAmountError } from "../errors/invalid-amount.error";
import type { ICreateCheckoutSessionUseCase } from "./create-checkout-session.usecase.interface";

//FIX: directly uses env
@injectable()
export class CreateCheckoutSessionUseCase
	implements ICreateCheckoutSessionUseCase
{
	constructor(
		@inject(TYPES.Services.PlatformSettings)
		private readonly platformSettingsService: PlatformSettingsService,
		@inject(TYPES.Services.PaymentService)
		private readonly paymentService: IPaymentService,
		@inject(TYPES.Services.IdGenerator)
		private readonly idGenerator: IIdGenerator,
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
			throw new InvalidAmountError();
		}

		const successUrl = env.STRIPE_SUCCESS_URL;
		const cancelUrl = env.STRIPE_CANCEL_URL;

		const session = await this.paymentService.createCheckoutSession({
			userId: input.userId,
			coins: input.coins,
			amount: amountInMinor,
			currency: "inr",
			successUrl,
			cancelUrl,
			metadata: {
				userId: input.userId,
				coins: String(input.coins),
				coinValue: String(coinValue),
			},
		});

		const userTransaction = new PaymentTransaction(
			this.idGenerator.generate(),
			input.userId,
			PaymentProvider.Stripe,
			session.id,
			amountInMinor,
			"inr",
			PaymentStatus.Pending,
			input.coins,
			undefined,
			"user",
		);

		const platformTransaction = new PaymentTransaction(
			this.idGenerator.generate(),
			input.userId,
			PaymentProvider.Stripe,
			session.id,
			amountInMinor,
			"inr",
			PaymentStatus.Pending,
			input.coins,
			undefined,
			"platform",
		);

		await this.paymentTransactionRepository.create(userTransaction);
		await this.paymentTransactionRepository.create(platformTransaction);

		return {
			paymentId: userTransaction.id,
			url: session.url ?? null,
			amount: amountInCurrency,
			currency: "inr",
			coins: input.coins,
		};
	}
}
