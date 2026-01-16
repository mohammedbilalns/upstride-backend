import { IGetTransactionHistoryUC } from "../../../domain/useCases/wallets/get-transaction-history.uc.interface";
import { ILedgerRepository } from "../../../domain/repositories/ledger.repository.interface";
import {
    GetTransactionHistoryDto,
    TransactionResponseDto,
} from "../../dtos/wallet.dto";

export class GetTransactionHistoryUC implements IGetTransactionHistoryUC {
    constructor(private _ledgerRepository: ILedgerRepository) { }

    async execute(
        dto: GetTransactionHistoryDto,
    ): Promise<TransactionResponseDto[]> {
        const transactions = await this._ledgerRepository.findByWallet(
            dto.walletId,
            dto.limit,
            dto.offset,
        );

        return transactions.map((tx) => ({
            id: tx.id,
            transactionType: tx.transactionType,
            amount: tx.amount,
            balance: tx.balance,
            description: tx.description,
            metadata: tx.metadata,
            createdAt: tx.createdAt,
        }));
    }
}
