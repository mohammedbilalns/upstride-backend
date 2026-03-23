import { inject, injectable } from "inversify";
import { TYPES } from "../../../../shared/types/types";
import type { IPaymentService } from "../../../services/payment.service.interface";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import type {
	CreateCheckoutSessionInput,
	CreateCheckoutSessionOutput,
} from "../dtos/create-checkout-session.dto";
import { InvalidAmountError } from "../errors/invalid-amount.error";
import type { ICreateCheckoutSessionUseCase } from "./create-checkout-session.usecase.interface";

@injectable()
export class CreateCheckoutSessionUseCase
	implements ICreateCheckoutSessionUseCase
{
	constructor(
		@inject(TYPES.Services.PlatformSettings)
		private readonly platformSettingsService: PlatformSettingsService,
		@inject(TYPES.Services.PaymentService)
		private readonly paymentService: IPaymentService,
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

		const successUrl = input.successUrl;
		const cancelUrl = input.cancelUrl;

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

		return {
			paymentId: session.id,
			url: session.url ?? null,
			amount: amountInCurrency,
			currency: "inr",
			coins: input.coins,
		};
	}
}
