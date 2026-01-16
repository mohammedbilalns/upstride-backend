import {
    IRecordTransactionUC,
    RecordTransactionDto,
} from "../../../domain/useCases/wallets/record-transaction.uc.interface";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { ILedgerRepository } from "../../../domain/repositories/ledger.repository.interface";

export class RecordTransactionUC implements IRecordTransactionUC {
    constructor(
        private _walletRepository: IWalletRepository,
        private _ledgerRepository: ILedgerRepository,
    ) { }

    async execute(dto: RecordTransactionDto): Promise<void> {
        // Update wallet balance
        const updatedWallet = await this._walletRepository.updateBalance(
            dto.walletId,
            dto.amount,
        );

        // Record transaction in ledger
        await this._ledgerRepository.create({
            walletId: dto.walletId,
            transactionType: dto.transactionType,
            amount: dto.amount,
            balance: updatedWallet.balance,
            relatedEntityId: dto.relatedEntityId,
            relatedEntityType: dto.relatedEntityType,
            description: dto.description,
            metadata: dto.metadata,
        });
    }
}
