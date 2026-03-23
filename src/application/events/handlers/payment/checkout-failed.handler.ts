import { inject, injectable } from "inversify";
import type { CheckoutFailedEvent } from "../../../../domain/events/checkout-failed.event";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { CheckoutFailureHandler } from "./checkout-failure.handler";

@injectable()
export class CheckoutFailedHandler extends CheckoutFailureHandler {
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		_paymentTransactionRepository: IPaymentTransactionRepository,
	) {
		super(_paymentTransactionRepository);
	}

	async handleEvent(event: CheckoutFailedEvent): Promise<void> {
		await super.handle(event.payload);
	}
}
