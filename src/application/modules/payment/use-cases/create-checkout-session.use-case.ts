import { inject, injectable } from "inversify";
import { COIN_VALUE } from "../../../../shared/constants";
import { TYPES } from "../../../../shared/types/types";
import type { IPaymentService } from "../../../services/payment.service.interface";
import type {
	CreateCheckoutSessionInput,
	CreateCheckoutSessionOutput,
} from "../dtos/create-checkout-session.dto";
import { InvalidAmountError } from "../errors/invalid-amount.error";
import type { ICreateCheckoutSessionUseCase } from "./create-checkout-session.use-case.interface";

@injectable()
export class CreateCheckoutSessionUseCase
	implements ICreateCheckoutSessionUseCase
{
	constructor(
		@inject(TYPES.Services.PaymentService)
		private readonly _paymentService: IPaymentService,
	) {}

	async execute(
		input: CreateCheckoutSessionInput,
	): Promise<CreateCheckoutSessionOutput> {
		const amountInCurrency = input.coins / COIN_VALUE;
		const amountInMinor = Math.round(amountInCurrency * 100);

		if (amountInMinor <= 0) {
			throw new InvalidAmountError();
		}

		const successUrl = input.successUrl;
		const cancelUrl = input.cancelUrl;

		const session = await this._paymentService.createCheckoutSession({
			userId: input.userId,
			coins: input.coins,
			amount: amountInMinor,
			currency: "inr",
			successUrl,
			cancelUrl,
			metadata: {
				userId: input.userId,
				coins: String(input.coins),
				coinValue: String(COIN_VALUE),
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
