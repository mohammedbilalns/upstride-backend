import type {
	PaymentProvider,
	PaymentStatus,
} from "../../../domain/entities/payment-transactions.entity";

export interface GetPaymentTransactionsInput {
	userId: string;
	page: number;
	limit: number;
	sort?: "recent" | "old";
	status?: PaymentStatus;
}

export interface PaymentTransactionDto {
	id: string;
	paymentId: string;
	provider: PaymentProvider;
	amount: number;
	currency: string;
	coinsGranted: number;
	createdAt: Date;
}

export interface GetPaymentTransactionsOutput {
	items: PaymentTransactionDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
