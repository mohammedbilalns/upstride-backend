import {
    IGetPlatformAnalyticsUC,
    PlatformAnalyticsDto,
} from "../../../domain/useCases/analytics/get-platform-analytics.uc.interface";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { ILedgerRepository } from "../../../domain/repositories/ledger.repository.interface";
import { OwnerType } from "../../../domain/entities/wallet.entity";

export class GetPlatformAnalyticsUC implements IGetPlatformAnalyticsUC {
    constructor(
        private _walletRepository: IWalletRepository,
        private _ledgerRepository: ILedgerRepository,
    ) { }

    async execute(limit: number = 10, offset: number = 0): Promise<PlatformAnalyticsDto> {
        // Get platform wallet
        let platformWallet = await this._walletRepository.findByOwner(
            "PLATFORM",
            OwnerType.PLATFORM,
        );

        if (!platformWallet) {
            // Auto-create if missing
            platformWallet = await this._walletRepository.create({
                ownerId: "PLATFORM",
                ownerType: OwnerType.PLATFORM,
                currency: "INR",
                balance: 0
            });
        }

        // Get platform transactions with pagination
        const transactions = await this._ledgerRepository.findByWallet(
            platformWallet.id,
            limit,
            offset,
        );

        const totalTransactions = await this._ledgerRepository.countByWallet(platformWallet.id);

        return {
            platformBalance: platformWallet.balance,
            totalRevenue: platformWallet.balance,
            totalTransactions: totalTransactions,
            transactions: transactions.map((t) => ({
                id: t.id,
                amount: t.amount,
                description: t.description,
                transactionType: t.transactionType,
                createdAt: t.createdAt,
            })),
        };
    }
}
