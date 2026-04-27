import type {
	PaymentProvider,
	PaymentStatus,
	PaymentTransactionPaymentType,
	PaymentTransactionPurpose,
} from "../../../../domain/entities/payment-transactions.entity";

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
	direction: "credit" | "debit";
	purpose: PaymentTransactionPurpose;
	paymentType: PaymentTransactionPaymentType;
	createdAt: Date;
}

export interface GetPaymentTransactionsOutput {
	items: PaymentTransactionDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
