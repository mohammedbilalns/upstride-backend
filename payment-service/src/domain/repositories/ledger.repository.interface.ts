import { Ledger, RelatedEntityType } from "../entities/ledger.entity";

export interface ILedgerRepository {
    create(
        transaction: Omit<Ledger, "id" | "createdAt">,
    ): Promise<Ledger>;
    findByWallet(
        walletId: string,
        limit?: number,
        offset?: number,
    ): Promise<Ledger[]>;
    findByRelatedEntity(
        entityId: string,
        entityType: RelatedEntityType,
    ): Promise<Ledger[]>;
    countByWallet(walletId: string): Promise<number>;
}
