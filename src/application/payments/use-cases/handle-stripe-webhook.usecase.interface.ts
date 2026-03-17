import type { HandleStripeWebhookInput } from "../dtos/handle-stripe-webhook.dto";

export interface IHandleStripeWebhookUseCase {
	execute(input: HandleStripeWebhookInput): Promise<void>;
}
