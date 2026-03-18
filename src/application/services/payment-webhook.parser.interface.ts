export type PaymentWebhookEventType =
	| "checkout.session.completed"
	| "checkout.session.expired"
	| "checkout.session.async_payment_failed";

export interface PaymentWebhookEvent {
	type: PaymentWebhookEventType;
	sessionId: string;
	userId?: string;
	coins: number;
	amountMinor: number;
	currency: string;
}

export interface PaymentWebhookParseInput {
	signature: string;
	payload: Buffer;
}

export interface IPaymentWebhookParser {
	parse(input: PaymentWebhookParseInput): Promise<PaymentWebhookEvent | null>;
}
