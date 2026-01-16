import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { OwnerType } from "../../../domain/entities/wallet.entity";
import { ILedgerRepository } from "../../../domain/repositories/ledger.repository.interface";
import { TransactionType, RelatedEntityType } from "../../../domain/entities/ledger.entity";
import logger from "../../../common/utils/logger";

interface RefundBreakdown {
    userAmount: number;
    mentorAmount: number; // cancellation fee sent to mentor 
    platformAmount: number; // Cancellation fee kept by platform
}

import { ICreateWalletUC } from "../../../domain/useCases/wallets/create-wallet.uc.interface";

export class ProcessRefundUC {
    constructor(
        private _walletRepository: IWalletRepository,
        private _ledgerRepository: ILedgerRepository,
        private _createWalletUC: ICreateWalletUC,
    ) { }

    async execute(
        bookingId: string,
        userId: string,
        mentorId: string,
        refundBreakdown: RefundBreakdown,
    ): Promise<void> {
        logger.info(`Processing refund for booking ${bookingId}`);

        const platformWallet = await this._walletRepository.getPlatformWallet();

        const userWallet = await this._createWalletUC.execute({
            ownerId: userId,
            ownerType: OwnerType.USER,
            currency: "INR"
        });

        const mentorWallet = await this._walletRepository.findByOwner(mentorId, OwnerType.MENTOR);

        if (!platformWallet) {
            logger.error("Platform wallet not found for refund");
            throw new Error("Platform wallet not found");
        }

        //  Refund to User
        if (refundBreakdown.userAmount > 0) {
            await this._walletRepository.updateBalance(platformWallet.id, -refundBreakdown.userAmount);
            await this._walletRepository.updateBalance(userWallet.id, refundBreakdown.userAmount);

            await this._ledgerRepository.create({
                walletId: userWallet.id,
                transactionType: TransactionType.REFUND,
                amount: refundBreakdown.userAmount,
                balance: userWallet.balance + refundBreakdown.userAmount,
                relatedEntityId: bookingId,
                relatedEntityType: RelatedEntityType.BOOKING,
                description: `Refund for booking ${bookingId}`,
            });

        }

        //  Cancellation Fee to Mentor 
        if (refundBreakdown.mentorAmount > 0 && mentorWallet) {
            await this._walletRepository.updateBalance(platformWallet.id, -refundBreakdown.mentorAmount);
            await this._walletRepository.updateBalance(mentorWallet.id, refundBreakdown.mentorAmount);

            await this._ledgerRepository.create({
                walletId: mentorWallet.id,
                transactionType: TransactionType.REFUND,
                amount: refundBreakdown.mentorAmount,
                balance: mentorWallet.balance + refundBreakdown.mentorAmount,
                relatedEntityId: bookingId,
                relatedEntityType: RelatedEntityType.BOOKING,
                description: `Cancellation fee for booking ${bookingId}`,
            });
        }

        logger.info(`Refund processed for booking ${bookingId}`);
    }
}
