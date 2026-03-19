import { Types } from "mongoose";
import { PaymentTransaction } from "../../../../domain/entities/payment-transactions.entity";
import type { PaymentTransactionDocument } from "../models/payment-transactions.model";

export class PaymentTransactionMapper {
	static toDomain(doc: PaymentTransactionDocument): PaymentTransaction {
		return new PaymentTransaction(
			doc.paymentId,
			doc.userId.toString(),
			doc.provider,
			doc.providerPaymentId,
			doc.amount,
			doc.currency,
			doc.status,
			doc.coinsGranted,
			doc.createdAt,
			doc.transactionOwner,
		);
	}

	static toDocument(
		entity: PaymentTransaction,
	): Partial<PaymentTransactionDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			paymentId: entity.id,
			provider: entity.provider,
			providerPaymentId: entity.providerPaymentId,
			amount: entity.amount,
			currency: entity.currency,
			status: entity.status,
			coinsGranted: entity.coinsGranted,
			transactionOwner: entity.transactionOwner,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
