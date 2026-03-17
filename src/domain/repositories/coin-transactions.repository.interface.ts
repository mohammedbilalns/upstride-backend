import type {
	CoinTransaction,
	CoinTransactionType,
} from "../entities/coin-transactions.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
} from "./capabilities";

export interface CoinTransactionQuery {
	userId?: string;
	type?: CoinTransactionType | CoinTransactionType[];
	referenceType?: string;
	referenceId?: string;
}

export interface ICoinTransactionRepository
	extends CreatableRepository<CoinTransaction>,
		FindByIdRepository<CoinTransaction>,
		QueryableRepository<CoinTransaction, CoinTransactionQuery>,
		PaginatableRepository<CoinTransaction, CoinTransactionQuery> {
	findAllByUserId(userId: string): Promise<CoinTransaction[]>;
}
