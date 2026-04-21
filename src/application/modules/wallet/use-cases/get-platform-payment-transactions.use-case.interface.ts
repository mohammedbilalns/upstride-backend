import type {
	GetPlatformPaymentTransactionsInput,
	GetPlatformPaymentTransactionsOutput,
} from "../dtos/get-platform-payment-transactions.dto";

export interface IGetPlatformPaymentTransactionsUseCase {
	execute(
		input: GetPlatformPaymentTransactionsInput,
	): Promise<GetPlatformPaymentTransactionsOutput>;
}
