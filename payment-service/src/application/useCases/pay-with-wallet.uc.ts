import { IPayWithWalletUC } from "../../domain/useCases/pay-with-wallet.usecase.interface";
import { PayWithWalletDto } from "../../application/dtos/payment.dto";
import { IWalletRepository } from "../../domain/repositories/wallet.repository.interface";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { IRecordTransactionUC } from "../../domain/useCases/wallets/record-transaction.uc.interface";
import { ICreateWalletUC } from "../../domain/useCases/wallets/create-wallet.uc.interface";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { OwnerType } from "../../domain/entities/wallet.entity";
import { AppError } from "../../application/errors/app-error";
import { ErrorMessage } from "../../common/enums/error-messages";
import { HttpStatus } from "../../common/enums";
import { TransactionType, RelatedEntityType } from "../../domain/entities/ledger.entity";
import { QueueEvents } from "../../common/enums/queue-events";

const PLATFORM_COMMISSION_RATE = 0.1; // 10%
const MENTOR_COMMISSION_RATE = 0.9; // 90%

export class PayWithWalletUC implements IPayWithWalletUC {
    constructor(
        private _walletRepository: IWalletRepository,
        private _paymentRepository: IPaymentRepository,
        private _recordTransactionUC: IRecordTransactionUC,
        private _createWalletUC: ICreateWalletUC,
        private _eventBus: IEventBus,
    ) { }

    async execute(data: PayWithWalletDto): Promise<void> {
        // Get User Wallet
        const userWallet = await this._walletRepository.findByOwner(data.userId, OwnerType.USER);
        if (!userWallet) {
            throw new AppError(ErrorMessage.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        //  Check Balance
        if (userWallet.balance < data.amount) {
            throw new AppError(ErrorMessage.INSUFFICIENT_BALANCE, HttpStatus.BAD_REQUEST);
        }


        await this._recordTransactionUC.execute({
            walletId: userWallet.id,
            transactionType: TransactionType.PAYMENT,

            amount: -data.amount,
            relatedEntityId: data.slotId,
            relatedEntityType: RelatedEntityType.BOOKING,
            description: `Payment for booking slot ${data.slotId}`,
            metadata: {
                mentorId: data.mentorId,
                slotId: data.slotId
            }
        });


        //  Create Payment Record
        const payment = await this._paymentRepository.create({
            userId: data.userId,
            mentorId: data.mentorId,
            bookingId: data.bookingId,
            sessionId: data.slotId,
            amount: data.amount,
            currency: data.currency || "INR",
            status: "COMPLETED",
            paymentMethod: "WALLET",
            transactionId: `WALLET_${Date.now()}_${data.userId}`,
            orderId: `WALLET_${Date.now()}`, // Dummy order ID
            purpose: "BOOKING",
            createdAt: new Date(),
            updatedAt: new Date()
        } as any);

        //  Create/Get Receiver Wallets
        const [mentorWallet, platformWallet] = await Promise.all([
            this._createWalletUC.execute({
                ownerId: data.mentorId,
                ownerType: OwnerType.MENTOR,
                currency: data.currency || "INR",
            }),
            this._createWalletUC.execute({
                ownerId: "PLATFORM",
                ownerType: OwnerType.PLATFORM,
                currency: data.currency || "INR",
            }),
        ]);

        //  Calculate Split
        const platformAmount = data.amount * PLATFORM_COMMISSION_RATE;
        const mentorAmount = data.amount * MENTOR_COMMISSION_RATE;

        //  Credit Receivers
        await Promise.all([
            this._recordTransactionUC.execute({
                walletId: mentorWallet.id,
                transactionType: TransactionType.PAYMENT,
                amount: mentorAmount,
                relatedEntityId: data.slotId,
                relatedEntityType: RelatedEntityType.BOOKING,
                description: `Payment received for booking ${data.slotId}`,
                metadata: {
                    paymentId: payment.id,
                    totalAmount: data.amount,
                    commissionRate: MENTOR_COMMISSION_RATE,
                    platformCommission: platformAmount,
                },
            }),
            this._recordTransactionUC.execute({
                walletId: platformWallet.id,
                transactionType: TransactionType.COMMISSION,
                amount: platformAmount,
                relatedEntityId: data.slotId,
                relatedEntityType: RelatedEntityType.BOOKING,
                description: `Platform commission for booking ${data.slotId}`,
                metadata: {
                    paymentId: payment.id,
                    totalAmount: data.amount,
                    commissionRate: PLATFORM_COMMISSION_RATE,
                    mentorAmount: mentorAmount,
                },
            }),
        ]);

        //  Publish Event
        const eventPayload = {
            orderId: payment.bookingId || payment.transactionId,
            paymentId: payment.id,
            userId: data.userId,
            mentorId: data.mentorId,
            amount: data.amount,
            mentorAmount: mentorAmount,
            platformAmount: platformAmount,

        };

        await this._eventBus.publish(QueueEvents.PAYMENT_COMPLETED, eventPayload);
    }
}
