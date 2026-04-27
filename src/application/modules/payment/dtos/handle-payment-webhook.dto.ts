export interface HandlePaymentWebhookInput {
	signature: string;
	payload: Buffer;
}
