import type { PaymentProvider } from "../entities/payment-transactions.entity";

export type PaymentEventType =
	| "checkout.session.completed"
	| "checkout.session.expired"
	| "checkout.session.async_payment_failed";

export interface PaymentEventPayload {
	type: PaymentEventType;
	provider: PaymentProvider;
	sessionId: string;
	userId?: string;
	coins: number;
	amountMinor: number;
	currency: string;
	metadata?: Record<string, string>;
}
