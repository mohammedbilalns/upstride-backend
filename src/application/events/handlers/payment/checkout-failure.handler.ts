import { injectable } from "inversify";
import { PaymentStatus } from "../../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import type { PaymentWebhookEvent } from "../../../services/payment-webhook.parser.interface";

@injectable()
export abstract class CheckoutFailureHandler {
	constructor(protected readonly _repo: IPaymentTransactionRepository) {}

	async handle(event: PaymentWebhookEvent): Promise<void> {
		await Promise.all([
			this._repo.updateStatusByProviderPaymentIdAndOwner(
				event.sessionId,
				PaymentStatus.Failed,
				"user",
			),
			this._repo.updateStatusByProviderPaymentIdAndOwner(
				event.sessionId,
				PaymentStatus.Failed,
				"platform",
			),
		]);
	}
}
