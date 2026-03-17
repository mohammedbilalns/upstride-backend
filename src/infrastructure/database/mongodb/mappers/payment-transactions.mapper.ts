import { Types } from "mongoose";
import { PaymentTransaction } from "../../../../domain/entities/payment-transactions.entity";
import type { PaymentTransactionDocument } from "../models/payment-transactions.model";

export class PaymentTransactionMapper {
	static toDomain(doc: PaymentTransactionDocument): PaymentTransaction {
		return new PaymentTransaction(
			doc._id.toString(),
			doc.userId.toString(),
			doc.provider,
			doc.providerPaymentId,
			doc.amount,
			doc.currency,
			doc.status,
			doc.coinsGranted,
		);
	}

	static toDocument(
		entity: PaymentTransaction,
	): Partial<PaymentTransactionDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			provider: entity.provider,
			providerPaymentId: entity.providerPaymentId,
			amount: entity.amount,
			currency: entity.currency,
			status: entity.status,
			coinsGranted: entity.coinsGranted,
		};
	}
}
