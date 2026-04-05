import { inject, injectable } from "inversify";
import type { CheckoutFailedEvent } from "../../../../domain/events/checkout-failed.event";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { EventHandler } from "../../event-handler.interface";
import { CheckoutFailureHandler } from "./checkout-failure.handler";

@injectable()
export class CheckoutFailedHandler
	extends CheckoutFailureHandler
	implements EventHandler<CheckoutFailedEvent>
{
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		_paymentTransactionRepository: IPaymentTransactionRepository,
	) {
		super(_paymentTransactionRepository);
	}

	async handle(event: CheckoutFailedEvent): Promise<void> {
		await super.handleFailure(event.payload);
	}
}
