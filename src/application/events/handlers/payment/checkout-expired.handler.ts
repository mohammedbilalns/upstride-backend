import { inject, injectable } from "inversify";
import type { CheckoutExpiredEvent } from "../../../../domain/events/checkout-expired.event";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { EventHandler } from "../../event-handler.interface";
import { CheckoutFailureHandler } from "./checkout-failure.handler";

@injectable()
export class CheckoutExpiredHandler
	extends CheckoutFailureHandler
	implements EventHandler<CheckoutExpiredEvent>
{
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		_paymentTransactionRepository: IPaymentTransactionRepository,
	) {
		super(_paymentTransactionRepository);
	}

	async handle(event: CheckoutExpiredEvent): Promise<void> {
		await super.handleFailure(event.payload);
	}
}
