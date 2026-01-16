import {
    TransactionType,
    RelatedEntityType,
} from "../../entities/ledger.entity";

export interface RecordTransactionDto {
    walletId: string;
    transactionType: TransactionType;
    amount: number;
    relatedEntityId: string;
    relatedEntityType: RelatedEntityType;
    description: string;
    metadata?: Record<string, any>;
}

export interface IRecordTransactionUC {
    execute(dto: RecordTransactionDto): Promise<void>;
}
