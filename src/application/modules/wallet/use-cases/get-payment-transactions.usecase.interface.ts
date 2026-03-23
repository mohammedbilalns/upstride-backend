import type {
	GetPaymentTransactionsInput,
	GetPaymentTransactionsOutput,
} from "../dtos/get-payment-transactions.dto";

export interface IGetPaymentTransactionsUseCase {
	execute(
		input: GetPaymentTransactionsInput,
	): Promise<GetPaymentTransactionsOutput>;
}
