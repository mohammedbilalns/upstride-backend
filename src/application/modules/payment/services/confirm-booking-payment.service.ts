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
import type { JobQueuePort } from "../../../ports/job-queue.port";
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
		@inject(TYPES.Services.JobQueue)
		private readonly _jobQueue: JobQueuePort,
	) {}

	async confirm({
		bookingId,
		sessionId,
		amountMinor,
		currency,
	}: ConfirmBookingPaymentParams): Promise<void> {
		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking) {
			logger.error(
				{ bookingId },
				"Booking not found during payment confirmation",
			);
			return;
		}

		const payerId = booking.menteeId;
		const start = new Date(booking.startTime);

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

		const bookingsForDay = await this._bookingRepository.findByMentorIdAndDate(
			booking.mentorId,
			start,
			{ includeFailed: true },
		);

		const staleSiblingBookings = bookingsForDay.filter((sibling) => {
			if (sibling.id === booking.id) return false;

			const siblingStart = new Date(sibling.startTime).getTime();
			const siblingEnd = new Date(sibling.endTime).getTime();
			const bookingStart = start.getTime();
			const bookingEnd = new Date(booking.endTime).getTime();

			const overlaps = bookingStart < siblingEnd && bookingEnd > siblingStart;

			return overlaps && sibling.paymentStatus !== "COMPLETED";
		});

		if (staleSiblingBookings.length > 0) {
			await Promise.all(
				staleSiblingBookings.map((sibling) =>
					this._bookingRepository.updateById(sibling.id, {
						status: "CANCELLED_BY_MENTEE",
					}),
				),
			);
		}

		const oneHourBefore = start.getTime() - 60 * 60 * 1000;
		const fiveMinutesBefore = start.getTime() - 5 * 60 * 1000;
		const now = Date.now();
		const mentorUserId = booking.mentorUserId;

		if (mentorUserId && oneHourBefore > now) {
			await this._jobQueue.enqueue(
				"send-session-reminder",
				{
					bookingId: booking.id,
					mentorId: mentorUserId,
					menteeId: booking.menteeId,
					label: "1 hour",
				},
				{ delay: oneHourBefore - now },
			);
		}

		if (mentorUserId && fiveMinutesBefore > now) {
			await this._jobQueue.enqueue(
				"send-session-reminder",
				{
					bookingId: booking.id,
					mentorId: mentorUserId,
					menteeId: booking.menteeId,
					label: "5 minutes",
				},
				{ delay: fiveMinutesBefore - now },
			);
		}

		await Promise.all([
			this._paymentTransactionRepository.create(
				new PaymentTransaction(
					this._idGenerator.generate(),
					payerId,
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
					payerId,
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
