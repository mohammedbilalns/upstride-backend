export interface HandleStripeWebhookInput {
	signature: string;
	payload: Buffer;
}
