import type { PaymentWebhookEvent } from "../../../services/payment-webhook.parser.interface";

export interface ProcessWalletTopupParams {
	userId?: string;
	coins: number;
	currency: string;
	amountMinor: number;
	sessionId: string;
	provider: PaymentWebhookEvent["provider"];
}

export interface IProcessWalletTopupService {
	process(params: ProcessWalletTopupParams): Promise<void>;
}
