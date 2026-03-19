import { injectable } from "inversify";
import type { PlatformWallet } from "../../../../domain/entities/platform-wallet.entity";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import { PlatformWalletMapper } from "../mappers/platform-wallet.mapper";
import {
	type PlatformWalletDocument,
	PlatformWalletModel,
} from "../models/platform-wallet.model";
import { AbstractMongoRepository } from "./abstract.repository";

const PLATFORM_WALLET_KEY = "platform";

@injectable()
export class MongoPlatformWalletRepository
	extends AbstractMongoRepository<PlatformWallet, PlatformWalletDocument>
	implements IPlatformWalletRepository
{
	constructor() {
		super(PlatformWalletModel);
	}

	protected toDomain(doc: PlatformWalletDocument) {
		return PlatformWalletMapper.toDomain(doc);
	}

	protected toDocument(entity: PlatformWallet) {
		return PlatformWalletMapper.toDocument(entity);
	}

	async get() {
		const doc = await this.model.findOne({ key: PLATFORM_WALLET_KEY }).lean();
		return doc ? this.toDomain(doc as PlatformWalletDocument) : null;
	}

	async getOrCreate() {
		const doc = await this.model
			.findOneAndUpdate(
				{ key: PLATFORM_WALLET_KEY },
				{ $setOnInsert: { key: PLATFORM_WALLET_KEY, balance: 0 } },
				{ new: true, upsert: true },
			)
			.lean();
		return this.toDomain(doc as PlatformWalletDocument);
	}

	async incrementBalance(amount: number) {
		const doc = await this.model
			.findOneAndUpdate(
				{ key: PLATFORM_WALLET_KEY },
				{
					$inc: { balance: amount },
					$setOnInsert: { key: PLATFORM_WALLET_KEY },
				},
				{ new: true, upsert: true },
			)
			.lean();
		return this.toDomain(doc as PlatformWalletDocument);
	}
}
