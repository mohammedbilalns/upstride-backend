import {
	type CoinTransaction,
	CoinTransactionType,
} from "../../../domain/entities/coin-transactions.entity";
import type { CoinTransactionDto } from "../dtos/get-coin-transactions.dto";

const DEBIT_COIN_TYPES = new Set<CoinTransactionType>([
	CoinTransactionType.SessionSpend,
	CoinTransactionType.AppreciationSpend,
]);

export class CoinTransactionDtoMapper {
	static toDTO(entity: CoinTransaction): CoinTransactionDto {
		const direction = DEBIT_COIN_TYPES.has(entity.type) ? "debit" : "credit";
		const transactionOwner = entity.transactionOwner ?? "user";

		return {
			id: entity.id,
			amount: entity.amount,
			type: entity.type,
			transactionOwner,
			direction,
			createdAt: entity.createdAt,
		};
	}

	static toDTOs(entities: CoinTransaction[]): CoinTransactionDto[] {
		return entities.map((entity) => CoinTransactionDtoMapper.toDTO(entity));
	}
}
