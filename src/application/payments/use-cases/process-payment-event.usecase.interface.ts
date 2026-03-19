import type { PaymentWebhookEvent } from "../../services/payment-webhook.parser.interface";

export interface IProcessPaymentEventUseCase {
	execute(event: PaymentWebhookEvent): Promise<void>;
}
