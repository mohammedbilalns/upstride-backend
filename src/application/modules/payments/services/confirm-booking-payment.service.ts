import { inject, injectable } from "inversify";
import {
	PaymentProvider,
	PaymentStatus,
	PaymentTransaction,
} from "../../../../domain/entities/payment-transactions.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { getClientBaseUrl } from "../../../../shared/utilities/url.util";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type {
	ConfirmBookingPaymentParams,
	IConfirmBookingPaymentService,
} from "./confirm-booking-payment.service.interface";

@injectable()
export class ConfirmBookingPaymentService
	implements IConfirmBookingPaymentService
{
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepository: IPlatformWalletRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async confirm({
		bookingId,
		sessionId,
		amountMinor,
		currency,
		userId,
	}: ConfirmBookingPaymentParams): Promise<void> {
		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking) {
			logger.error(
				{ bookingId },
				"Booking not found during payment confirmation",
			);
			return;
		}

		if (booking.paymentStatus === "COMPLETED") return;

		const meetingLink =
			booking.meetingLink && booking.meetingLink !== "Pending"
				? booking.meetingLink
				: `${getClientBaseUrl()}/sessions/${booking.id}`;

		await this._bookingRepository.updateById(bookingId, {
			status: "CONFIRMED",
			paymentStatus: "COMPLETED",
			meetingLink,
		});

		await Promise.all([
			this._paymentTransactionRepository.create(
				new PaymentTransaction(
					this._idGenerator.generate(),
					userId,
					PaymentProvider.Stripe,
					sessionId,
					amountMinor,
					currency,
					PaymentStatus.Completed,
					0,
					"session",
					"STRIPE",
					undefined,
					"user",
				),
			),
			this._paymentTransactionRepository.create(
				new PaymentTransaction(
					this._idGenerator.generate(),
					userId,
					PaymentProvider.Stripe,
					sessionId,
					amountMinor,
					currency,
					PaymentStatus.Completed,
					0,
					"session",
					"STRIPE",
					undefined,
					"platform",
				),
			),
		]);

		if (Number.isFinite(amountMinor) && amountMinor > 0) {
			await this._platformWalletRepository.incrementBalance(amountMinor);
		}

		logger.info(
			{ bookingId, sessionId },
			"Booking confirmed and ledger updated via Stripe payment",
		);
	}
}
