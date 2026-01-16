export enum TransactionType {
    PAYMENT = "PAYMENT",
    REFUND = "REFUND",
    COMMISSION = "COMMISSION",
    WITHDRAWAL = "WITHDRAWAL",
}

export enum RelatedEntityType {
    BOOKING = "BOOKING",
    PAYMENT = "PAYMENT",
}

export interface Ledger {
    id: string;
    walletId: string;
    transactionType: TransactionType;
    amount: number;
    balance: number;
    relatedEntityId: string;
    relatedEntityType: RelatedEntityType;
    description: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
