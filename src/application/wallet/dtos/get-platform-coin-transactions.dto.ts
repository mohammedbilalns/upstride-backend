import type { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import type { CoinTransactionDto } from "./get-coin-transactions.dto";

export interface GetPlatformCoinTransactionsInput {
	page: number;
	limit: number;
	sort?: "recent" | "old";
	type?: CoinTransactionType;
}

export interface GetPlatformCoinTransactionsOutput {
	items: CoinTransactionDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
