import type { HandlePaymentWebhookInput } from "../dtos/handle-payment-webhook.dto";

export interface IHandlePaymentWebhookUseCase {
	execute(input: HandlePaymentWebhookInput): Promise<void>;
}
