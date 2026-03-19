import type {
	PaymentProvider,
	PaymentStatus,
	PaymentTransaction,
} from "../entities/payment-transactions.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
} from "./capabilities";

export interface PaymentTransactionQuery {
	userId?: string;
	provider?: PaymentProvider;
	status?: PaymentStatus | PaymentStatus[];
	providerPaymentId?: string;
	transactionOwner?: "platform" | "user" | "mentor";
}

export interface IPaymentTransactionRepository
	extends CreatableRepository<PaymentTransaction>,
		FindByIdRepository<PaymentTransaction>,
		QueryableRepository<PaymentTransaction, PaymentTransactionQuery>,
		PaginatableRepository<PaymentTransaction, PaymentTransactionQuery> {
	findByProviderPaymentId(
		providerPaymentId: string,
	): Promise<PaymentTransaction | null>;
	findByProviderPaymentIdAndOwner(
		providerPaymentId: string,
		transactionOwner: "platform" | "user" | "mentor",
	): Promise<PaymentTransaction | null>;
	findAllByUserId(userId: string): Promise<PaymentTransaction[]>;
	updateStatusByProviderPaymentId(
		providerPaymentId: string,
		status: PaymentStatus,
	): Promise<PaymentTransaction | null>;
	updateStatusByProviderPaymentIdAndOwner(
		providerPaymentId: string,
		status: PaymentStatus,
		transactionOwner: "platform" | "user" | "mentor",
	): Promise<PaymentTransaction | null>;
}
