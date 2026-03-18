import type {
	GetPlatformCoinTransactionsInput,
	GetPlatformCoinTransactionsOutput,
} from "../dtos/get-platform-coin-transactions.dto";

export interface IGetPlatformCoinTransactionsUseCase {
	execute(
		input: GetPlatformCoinTransactionsInput,
	): Promise<GetPlatformCoinTransactionsOutput>;
}
