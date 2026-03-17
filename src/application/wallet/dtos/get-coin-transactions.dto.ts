import type { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";

export interface GetCoinTransactionsInput {
	userId: string;
	page: number;
	limit: number;
	sort?: "recent" | "old";
	type?: CoinTransactionType;
}

export interface CoinTransactionDto {
	id: string;
	amount: number;
	type: CoinTransactionType;
	createdAt: Date;
}

export interface GetCoinTransactionsOutput {
	items: CoinTransactionDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
