import { inject, injectable } from "inversify";
import type { Booking } from "../../../../domain/entities/booking.entity";
import { CoinTransactionType } from "../../../../domain/entities/coin-transactions.entity";
import {
	PaymentProvider,
	PaymentTransaction,
	PaymentStatus as PaymentTransactionStatus,
} from "../../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { ICreateNotificationUseCase } from "../../../modules/notification/use-cases/create-notification.use-case.interface";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { IWalletService } from "../../../services/wallet.service.interface";

@injectable()
export class SessionRefundService {
	constructor(
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepository: IPlatformWalletRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async refundBookedUser(
		booking: Booking,
		refundAmount: number,
		refundAmountMinor: number,
		settledAt: Date,
	): Promise<void> {
		if (refundAmount <= 0) {
			return;
		}

		await this._walletService.credit(
			booking.menteeId,
			refundAmount,
			CoinTransactionType.Refund,
			"session_booking",
			booking.id,
		);

		await this._createNotificationUseCase.execute({
			userId: booking.menteeId,
			title: "Session Refund Issued",
			description: `A refund of ${refundAmount} coins has been credited for booking ${booking.id}.`,
			type: "SESSION",
			event: "SESSION_REFUNDED",
			relatedEntityId: booking.id,
			metadata: {
				bookingId: booking.id,
				refundAmount,
				refundAmountMinor,
				paymentType: booking.paymentType,
			},
		});

		if (refundAmountMinor > 0) {
			const providerPaymentId = `refund_${booking.id}`;
			const existing =
				await this._paymentTransactionRepository.findByProviderPaymentIdAndOwner(
					providerPaymentId,
					"platform",
				);

			if (!existing) {
				await this._paymentTransactionRepository.create(
					new PaymentTransaction(
						this._idGenerator.generate(),
						booking.menteeId,
						booking.paymentType === "STRIPE"
							? PaymentProvider.Stripe
							: PaymentProvider.Internal,
						providerPaymentId,
						-refundAmountMinor,
						"inr",
						PaymentTransactionStatus.Refunded,
						0,
						"session",
						booking.paymentType,
						settledAt,
						"platform",
					),
				);
			}

			await this._platformWalletRepository.incrementBalance(-refundAmountMinor);
		}
	}
}
