import { PlatformWallet } from "../../../../domain/entities/platform-wallet.entity";
import type { PlatformWalletDocument } from "../models/platform-wallet.model";

export class PlatformWalletMapper {
	static toDomain(doc: PlatformWalletDocument): PlatformWallet {
		return new PlatformWallet(
			doc._id.toString(),
			doc.balance,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: PlatformWallet): Partial<PlatformWalletDocument> {
		return {
			balance: entity.balance,
		};
	}
}
