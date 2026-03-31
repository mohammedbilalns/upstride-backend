import type { PaymentTransaction } from "../../../../domain/entities/payment-transactions.entity";
import type { PaymentTransactionDto } from "../dtos/get-payment-transactions.dto";

export class PaymentTransactionDtoMapper {
	static toDTO(entity: PaymentTransaction): PaymentTransactionDto {
		const owner = entity.transactionOwner ?? "user";
		const direction = owner === "user" ? "debit" : "credit";

		return {
			id: entity.id,
			paymentId: entity.id,
			provider: entity.provider,
			amount: entity.amount / 100,
			currency: entity.currency,
			coinsGranted: entity.coinsGranted,
			direction,
			purpose: entity.purpose,
			paymentType: entity.paymentType,
			createdAt: entity.createdAt,
		};
	}

	static toDTOs(entities: PaymentTransaction[]): PaymentTransactionDto[] {
		return entities.map((entity) => PaymentTransactionDtoMapper.toDTO(entity));
	}
}
