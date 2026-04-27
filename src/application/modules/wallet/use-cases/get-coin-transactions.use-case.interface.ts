import type {
	GetCoinTransactionsInput,
	GetCoinTransactionsOutput,
} from "../dtos/get-coin-transactions.dto";

export interface IGetCoinTransactionsUseCase {
	execute(input: GetCoinTransactionsInput): Promise<GetCoinTransactionsOutput>;
}
