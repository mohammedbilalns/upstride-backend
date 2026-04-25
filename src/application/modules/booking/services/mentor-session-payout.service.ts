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
export class MentorSessionPayoutService {
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

	async creditMentor(
		booking: Booking,
		mentorUserId: string,
		mentorCoins: number,
		mentorPayoutMinor: number,
		settledAt: Date,
	): Promise<void> {
		if (mentorCoins > 0) {
			await this._walletService.credit(
				mentorUserId,
				mentorCoins,
				CoinTransactionType.SessionEarning,
				"Booking",
				booking.id,
			);

			await this._createNotificationUseCase.execute({
				userId: mentorUserId,
				title: "Session Earnings Credited",
				description: `Your wallet has been credited with ${mentorCoins} coins for booking ${booking.id}.`,
				type: "SESSION",
				event: "SESSION_EARNED",
				relatedEntityId: booking.id,
				metadata: {
					bookingId: booking.id,
					amount: mentorCoins,
					currency: "COINS",
				},
			});
		}

		if (mentorPayoutMinor > 0) {
			await this._platformWalletRepository.incrementBalance(-mentorPayoutMinor);
			await this._paymentTransactionRepository.create(
				new PaymentTransaction(
					this._idGenerator.generate(),
					booking.menteeId,
					booking.paymentType === "STRIPE"
						? PaymentProvider.Stripe
						: PaymentProvider.Internal,
					`session_payout_${booking.id}`,
					-mentorPayoutMinor,
					"inr",
					PaymentTransactionStatus.Completed,
					0,
					"session",
					booking.paymentType,
					settledAt,
					"platform",
				),
			);
		}
	}
}
