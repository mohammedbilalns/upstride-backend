import type { CoinTransaction } from "../../../domain/entities/coin-transactions.entity";
import type { CoinTransactionDto } from "../dtos/get-coin-transactions.dto";

export class CoinTransactionDtoMapper {
	static toDTO(entity: CoinTransaction): CoinTransactionDto {
		return {
			id: entity.id,
			amount: entity.amount,
			type: entity.type,
			createdAt: entity.createdAt,
		};
	}

	static toDTOs(entities: CoinTransaction[]): CoinTransactionDto[] {
		return entities.map((entity) => CoinTransactionDtoMapper.toDTO(entity));
	}
}
