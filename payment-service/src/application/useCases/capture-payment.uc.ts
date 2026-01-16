import { VerifyPaymentDto } from "../../application/dtos/payment.dto";
import { ICapturePaymentUC } from "../../domain/useCases/capture-payment.usecase.interface";
import { IPaymentRepository } from "../../domain/repositories/payment.repository.interface";
import { IPaymentGatewayService } from "../../domain/services/payment-gateway.service.interface";
import { AppError } from "../../application/errors/app-error";
import { HttpStatus } from "../../common/enums";
import { ErrorMessage } from "../../common/enums/error-messages";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { QueueEvents } from "../../common/enums/queue-events";
import { ICreateWalletUC } from "../../domain/useCases/wallets/create-wallet.uc.interface";
import { IRecordTransactionUC } from "../../domain/useCases/wallets/record-transaction.uc.interface";
import { OwnerType } from "../../domain/entities/wallet.entity";
import {
	TransactionType,
	RelatedEntityType,
} from "../../domain/entities/ledger.entity";

const PLATFORM_COMMISSION_RATE = 0.1; // 10%
const MENTOR_COMMISSION_RATE = 0.9; // 90%

export class CapturePaymentUC implements ICapturePaymentUC {
	constructor(
		private _paymentRepository: IPaymentRepository,
		private _paymentGatewayService: IPaymentGatewayService,
		private _eventBus: IEventBus,
		private _createWalletUC: ICreateWalletUC,
		private _recordTransactionUC: IRecordTransactionUC,
	) { }

	async execute(verificationDetails: VerifyPaymentDto) {
		//  Find Payment
		let payment = await this._paymentRepository.findByTransactionId(
			verificationDetails.orderId,
		);

		if (!payment) {
			throw new AppError(ErrorMessage.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		if (payment.status === "COMPLETED") {
			return payment;
		}

		// Verify Signature
		const isValid = this._paymentGatewayService.verifyPayment(
			verificationDetails.orderId,
			verificationDetails.paymentId,
			verificationDetails.signature,
		);

		if (isValid) {
			// Update DB
			const updated = await this._paymentRepository.updateStatus(
				payment.id,
				"COMPLETED",
			);

			// HANDLE WALLET LOAD
			if (payment.purpose === 'WALLET_LOAD') {
				const userWallet = await this._createWalletUC.execute({
					ownerId: payment.userId,
					ownerType: OwnerType.USER,
					currency: payment.currency,
				});

				await this._recordTransactionUC.execute({
					walletId: userWallet.id,
					transactionType: TransactionType.PAYMENT,
					amount: payment.amount,
					relatedEntityId: payment.id,
					relatedEntityType: RelatedEntityType.PAYMENT,
					description: `Wallet top-up via payment ${payment.id}`,
					metadata: {
						paymentId: payment.id,
						orderId: payment.orderId,
					},
				});

				return updated;
			}

			// Create wallets if they don't exist
			const [mentorWallet, platformWallet] = await Promise.all([
				this._createWalletUC.execute({
					ownerId: payment.mentorId!,
					ownerType: OwnerType.MENTOR,
					currency: payment.currency,
				}),
				this._createWalletUC.execute({
					ownerId: "PLATFORM",
					ownerType: OwnerType.PLATFORM,
					currency: payment.currency,
				}),
				this._createWalletUC.execute({
					ownerId: payment.userId,
					ownerType: OwnerType.USER,
					currency: payment.currency,
				}),
			]);

			// Calculate commission split
			const platformAmount = payment.amount * PLATFORM_COMMISSION_RATE;
			const mentorAmount = payment.amount * MENTOR_COMMISSION_RATE;

			// Record transactions in ledgers
			await Promise.all([
				this._recordTransactionUC.execute({
					walletId: mentorWallet.id,
					transactionType: TransactionType.PAYMENT,
					amount: mentorAmount,
					relatedEntityId: payment.bookingId || payment.id,
					relatedEntityType: RelatedEntityType.BOOKING,
					description: `Payment received for booking ${payment.bookingId || payment.id}`,
					metadata: {
						paymentId: payment.id,
						totalAmount: payment.amount,
						commissionRate: MENTOR_COMMISSION_RATE,
						platformCommission: platformAmount,
					},
				}),
				this._recordTransactionUC.execute({
					walletId: platformWallet.id,
					transactionType: TransactionType.COMMISSION,
					amount: platformAmount,
					relatedEntityId: payment.bookingId || payment.id,
					relatedEntityType: RelatedEntityType.BOOKING,
					description: `Platform commission for booking ${payment.bookingId || payment.id}`,
					metadata: {
						paymentId: payment.id,
						totalAmount: payment.amount,
						commissionRate: PLATFORM_COMMISSION_RATE,
						mentorAmount: mentorAmount,
					},
				}),
			]);

			const eventPayload = {
				orderId: payment.bookingId || payment.transactionId,
				paymentId: payment.id,
				userId: payment.userId,
				mentorId: payment.mentorId,
				amount: payment.amount,
				mentorAmount: mentorAmount,
				platformAmount: platformAmount,
			};

			// Publish Payment Completed Event
			await this._eventBus.publish(QueueEvents.PAYMENT_COMPLETED, eventPayload);

			return updated;
		} else {
			await this._paymentRepository.updateStatus(payment.id, "FAILED");
			throw new AppError("Payment verification failed", HttpStatus.BAD_GATEWAY);
		}
	}
}
