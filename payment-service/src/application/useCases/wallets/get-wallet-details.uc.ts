import { IGetWalletDetailsUC } from "../../../domain/useCases/wallets/get-wallet-details.uc.interface";
import { WalletDetailsDto } from "../../../application/dtos/wallet.dto";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { ILedgerRepository } from "../../../domain/repositories/ledger.repository.interface";
import { OwnerType } from "../../../domain/entities/wallet.entity";

export class GetWalletDetailsUC implements IGetWalletDetailsUC {
    constructor(
        private _walletRepository: IWalletRepository,
        private _ledgerRepository: ILedgerRepository,
    ) { }

    async execute(data: {
        ownerId: string;
        ownerType: OwnerType;
        limit?: number;
        offset?: number;
    }): Promise<WalletDetailsDto> {
        let wallet = await this._walletRepository.findByOwner(
            data.ownerId,
            data.ownerType,
        );

        if (!wallet) {
            return {
                balance: 0,
                currency: "INR",
                totalTransactions: 0,
                transactions: [],
            };
        }

        const [transactions, totalTransactions] = await Promise.all([
            this._ledgerRepository.findByWallet(wallet.id, data.limit || 10, data.offset || 0),
            this._ledgerRepository.countByWallet(wallet.id),
        ]);

        return {
            balance: wallet.balance,
            currency: wallet.currency,
            totalTransactions,
            transactions,
        };
    }
}
