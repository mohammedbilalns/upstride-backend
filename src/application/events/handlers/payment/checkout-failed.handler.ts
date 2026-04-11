import { inject, injectable } from "inversify";
import { PaymentStatus } from "../../../../domain/entities/payment-transactions.entity";
import type { CheckoutFailedEvent } from "../../../../domain/events/checkout-failed.event";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { EventHandler } from "../../event-handler.interface";

@injectable()
export class CheckoutFailedHandler
	implements EventHandler<CheckoutFailedEvent>
{
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
	) {}

	private async handleFailure(sessionId: string): Promise<void> {
		await Promise.all([
			this._paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
				sessionId,
				PaymentStatus.Failed,
				"user",
			),
			this._paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
				sessionId,
				PaymentStatus.Failed,
				"platform",
			),
		]);
	}

	async handle(event: CheckoutFailedEvent): Promise<void> {
		await this.handleFailure(event.payload.sessionId);
	}
}
