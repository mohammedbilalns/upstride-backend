import type { CoinTransactionType } from "../../domain/entities/coin-transactions.entity";

export interface IWalletService {
	credit(
		userId: string,
		amount: number,
		type: CoinTransactionType,
		referenceType?: string,
		referenceId?: string,
	): Promise<void>;

	debit(
		userId: string,
		amount: number,
		type: CoinTransactionType,
		referenceType?: string,
		referenceId?: string,
	): Promise<void>;
}
