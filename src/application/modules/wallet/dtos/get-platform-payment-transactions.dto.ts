import type { PaymentStatus } from "../../../../domain/entities/payment-transactions.entity";
import type { PaymentTransactionDto } from "./get-payment-transactions.dto";

export interface GetPlatformPaymentTransactionsInput {
	page: number;
	limit: number;
	sort?: "recent" | "old";
	status?: PaymentStatus;
}

export interface GetPlatformPaymentTransactionsOutput {
	items: PaymentTransactionDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	summary: {
		effectiveRevenue: number;
	};
}
