import { ILedgerRepository } from "../../../domain/repositories/ledger.repository.interface";
import { Ledger, RelatedEntityType } from "../../../domain/entities/ledger.entity";
import { LedgerModel, LedgerDocument } from "../models/ledger.model";
import { BaseRepository } from "./base.repository";

export class LedgerRepository
    extends BaseRepository<Ledger, LedgerDocument>
    implements ILedgerRepository {
    constructor() {
        super(LedgerModel);
    }

    protected mapToDomain(doc: LedgerDocument): Ledger {
        return {
            id: doc._id.toString(),
            walletId: doc.walletId,
            transactionType: doc.transactionType,
            amount: doc.amount,
            balance: doc.balance,
            relatedEntityId: doc.relatedEntityId,
            relatedEntityType: doc.relatedEntityType,
            description: doc.description,
            metadata: doc.metadata,
            createdAt: doc.createdAt,
        };
    }

    async findByWallet(
        walletId: string,
        limit: number = 50,
        offset: number = 0,
    ): Promise<Ledger[]> {
        const transactions = await LedgerModel.find({ walletId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        return transactions.map((doc) => this.mapToDomain(doc));
    }

    async findByRelatedEntity(
        entityId: string,
        entityType: RelatedEntityType,
    ): Promise<Ledger[]> {
        const transactions = await LedgerModel.find({
            relatedEntityId: entityId,
            relatedEntityType: entityType,
        }).sort({ createdAt: -1 });

        return transactions.map((doc) => this.mapToDomain(doc));
    }

    async countByWallet(walletId: string): Promise<number> {
        return LedgerModel.countDocuments({ walletId });
    }
}
