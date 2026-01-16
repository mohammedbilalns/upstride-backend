import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { OwnerType } from "../../../domain/entities/wallet.entity";
import { ILedgerRepository } from "../../../domain/repositories/ledger.repository.interface";
import { TransactionType, RelatedEntityType } from "../../../domain/entities/ledger.entity";
import logger from "../../../common/utils/logger";

const COMMISSION_RATE = 0.1; // 10%
const MENTOR_SHARE = 0.9;   // 90%

export class ProcessPayoutUC {
    constructor(
        private _walletRepository: IWalletRepository,
        private _ledgerRepository: ILedgerRepository,
    ) { }

    /**
     * Processing payout when a session is completed.
     * Platform Wallet -> Mentor Wallet (90% of Session Price)
     * The remaining 10% stays in Platform Wallet (already there from booking).
     */
    async execute(
        sessionId: string,
        mentorId: string,
        amount: number, // Total price paid by user
    ): Promise<void> {
        logger.info(`Processing payout for session ${sessionId}`);

        const platformWallet = await this._walletRepository.getPlatformWallet();
        const mentorWallet = await this._walletRepository.findByOwner(mentorId, OwnerType.MENTOR);

        if (!platformWallet || !mentorWallet) {
            logger.error("Platform or Mentor wallet not found for payout");
            throw new Error("Wallets not found");
        }

        const payoutAmount = amount * MENTOR_SHARE;
        const commissionAmount = amount * COMMISSION_RATE;

        // Transfer payout to mentor
        await this._walletRepository.updateBalance(platformWallet.id, -payoutAmount);
        await this._walletRepository.updateBalance(mentorWallet.id, payoutAmount);

        // Record Payout Transaction (Mentor Credit)
        await this._ledgerRepository.create({
            walletId: mentorWallet.id,
            transactionType: TransactionType.PAYMENT, 
            amount: payoutAmount,
            balance: mentorWallet.balance + payoutAmount,
            relatedEntityId: sessionId,
            relatedEntityType: RelatedEntityType.BOOKING, 
            description: `Payout for session ${sessionId}`,
        });

        // Record Commission (Platform Revenue) 
        await this._ledgerRepository.create({
            walletId: platformWallet.id,
            transactionType: TransactionType.COMMISSION,
            amount: commissionAmount,
            balance: platformWallet.balance - payoutAmount, 
            relatedEntityId: sessionId,
            relatedEntityType: RelatedEntityType.BOOKING,
            description: `Commission for session ${sessionId}`,
        });


        logger.info(`Payout processed for session ${sessionId}. Amount: ${payoutAmount}`);
    }
}
