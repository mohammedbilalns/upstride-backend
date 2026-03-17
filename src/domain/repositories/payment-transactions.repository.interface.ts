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
}

export interface IPaymentTransactionRepository
	extends CreatableRepository<PaymentTransaction>,
		FindByIdRepository<PaymentTransaction>,
		QueryableRepository<PaymentTransaction, PaymentTransactionQuery>,
		PaginatableRepository<PaymentTransaction, PaymentTransactionQuery> {
	findByProviderPaymentId(
		providerPaymentId: string,
	): Promise<PaymentTransaction | null>;
	findAllByUserId(userId: string): Promise<PaymentTransaction[]>;
}
