import type { CoinTransaction } from "../../../../domain/entities/coin-transactions.entity";
import type { CoinTransactionDto } from "../dtos/get-coin-transactions.dto";

export class CoinTransactionDtoMapper {
	static toDTO(entity: CoinTransaction): CoinTransactionDto {
		const direction = entity.amount < 0 ? "debit" : "credit";
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
