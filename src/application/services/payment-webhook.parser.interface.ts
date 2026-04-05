import type {
	PaymentEventPayload,
	PaymentEventType,
} from "../../domain/events/payment-event-payload";

export interface PaymentWebhookParseInput {
	signature: string;
	payload: Buffer;
}

export interface IPaymentWebhookParser {
	parse(input: PaymentWebhookParseInput): Promise<PaymentEventPayload | null>;
}

export type PaymentWebhookEvent = PaymentEventPayload;
export type PaymentWebhookEventType = PaymentEventType;
