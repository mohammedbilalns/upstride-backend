import type {
	PaymentTransaction,
	PaymentTransactionPurpose,
} from "../../../../domain/entities/payment-transactions.entity";
import type { PaymentWebhookEvent } from "../../../services/payment-webhook.parser.interface";

export interface UpsertPaymentTransactionParams {
	existing?: PaymentTransaction | null;
	userId: string;
	provider: PaymentWebhookEvent["provider"];
	sessionId: string;
	amountMinor: number;
	currency: string;
	coins: number;
	purpose: PaymentTransactionPurpose;
	owner: "user" | "platform";
}

export interface IUpsertPaymentTransactionService {
	upsert(params: UpsertPaymentTransactionParams): Promise<void>;
}
