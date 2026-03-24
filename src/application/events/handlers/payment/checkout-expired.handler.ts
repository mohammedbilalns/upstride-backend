import { inject, injectable } from "inversify";
import type { CheckoutExpiredEvent } from "../../../../domain/events/checkout-expired.event";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { CheckoutFailureHandler } from "./checkout-failure.handler";

@injectable()
export class CheckoutExpiredHandler extends CheckoutFailureHandler {
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		_paymentTransactionRepository: IPaymentTransactionRepository,
	) {
		super(_paymentTransactionRepository);
	}

	async handleEvent(event: CheckoutExpiredEvent): Promise<void> {
		await super.handle(event.payload);
	}
}
