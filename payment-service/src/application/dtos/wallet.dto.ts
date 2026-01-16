import { OwnerType } from "../../domain/entities/wallet.entity";
import { Ledger } from "../../domain/entities/ledger.entity";

export interface CreateWalletDto {
    ownerId: string;
    ownerType: OwnerType;
    currency?: string;
}

export interface GetWalletBalanceDto {
    ownerId: string;
    ownerType: OwnerType;
}

export interface GetWalletByOwnerDto {
    ownerId: string;
    ownerType: OwnerType;
}

export interface GetTransactionHistoryDto {
    walletId: string;
    limit?: number;
    offset?: number;
}

export interface TransactionResponseDto {
    id: string;
    transactionType: string;
    amount: number;
    balance: number;
    description: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

export interface WalletBalanceResponseDto {
    walletId: string;
    balance: number;
    currency: string;
}

export interface WalletDetailsDto {
    balance: number;
    currency: string;
    totalTransactions: number;
    transactions: Ledger[];
}
