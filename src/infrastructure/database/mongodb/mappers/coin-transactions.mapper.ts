import { Types } from "mongoose";
import { CoinTransaction } from "../../../../domain/entities/coin-transactions.entity";
import type { CoinTransactionDocument } from "../models/coin-transactions.model";

export class CoinTransactionMapper {
	static toDomain(doc: CoinTransactionDocument): CoinTransaction {
		return new CoinTransaction(
			doc._id.toString(),
			doc.userId.toString(),
			doc.amount,
			doc.type,
			doc.referenceType,
			doc.referenceId,
			doc.createdAt,
			doc.transactionOwner,
		);
	}

	static toDocument(entity: CoinTransaction): Partial<CoinTransactionDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			amount: entity.amount,
			type: entity.type,
			referenceType: entity.referenceType,
			referenceId: entity.referenceId,
			transactionOwner: entity.transactionOwner,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
