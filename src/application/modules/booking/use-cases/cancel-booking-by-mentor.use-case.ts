import { inject, injectable } from "inversify";
import { Booking } from "../../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type { ICreateNotificationUseCase } from "../../notification/use-cases/create-notification.use-case.interface";
import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/booking.dto";
import {
	BookingAlreadyCancelledError,
	BookingNotFoundError,
	UnauthorizedBookingActionError,
} from "../errors/booking.errors";
import type { ICancelBookingByMentorUseCase } from "./cancel-booking-by-mentor.use-case.interface";
import type { IRefundSessionAmountUseCase } from "./refund-session-amount.use-case.interface";

@injectable()
export class CancelBookingByMentorUseCase
	implements ICancelBookingByMentorUseCase
{
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
		@inject(TYPES.UseCases.RefundSessionAmount)
		private readonly _refundSessionAmountUseCase: IRefundSessionAmountUseCase,
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(input: CancelBookingInput): Promise<CancelBookingResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (booking.mentorId !== mentor.id) {
			throw new UnauthorizedBookingActionError();
		}

		if (
			booking.status === "CANCELLED_BY_MENTEE" ||
			booking.status === "CANCELLED_BY_MENTOR"
		) {
			throw new BookingAlreadyCancelledError();
		}

		Booking.assertCancellable(booking.status);

		await this._bookingRepository.updateById(input.bookingId, {
			status: "CANCELLED_BY_MENTOR",
			notes: booking.notes
				? `${booking.notes}\nCancellation Reason: ${input.reason || "None provided"}`
				: `Cancellation Reason: ${input.reason || "None provided"}`,
		});

		const refundResult = await this._refundSessionAmountUseCase.execute({
			bookingId: booking.id,
			userId: booking.menteeId,
			startTime: booking.startTime,
			paymentType: booking.paymentType,
			paymentStatus: booking.paymentStatus,
			totalAmount: booking.totalAmount,
			cancelledBy: "mentor",
		});

		await this._createNotificationUseCase.execute({
			userId: booking.menteeId,
			actorId: mentor.userId,
			relatedEntityId: booking.id,
			title: "Session Cancelled by Mentor",
			description:
				refundResult.refund.amount > 0
					? `Your booking ${booking.id} was cancelled by the mentor. Refund: ${refundResult.refund.amount} coins (${refundResult.refund.percentage}%).`
					: `Your booking ${booking.id} was cancelled by the mentor. No refund was issued.`,
			type: "SESSION",
			event: "SESSION_CANCELLED",
			metadata: {
				bookingId: booking.id,
				cancelledBy: "mentor",
				cancellationReason: input.reason || "None provided",
				refundAmount: refundResult.refund.amount,
				refundPercentage: refundResult.refund.percentage,
				refundReason: refundResult.refund.reason,
				paymentType: booking.paymentType,
				paymentStatus: booking.paymentStatus,
			},
		});

		return {
			bookingId: booking.id,
			status: "CANCELLED_BY_MENTOR",
			refund: refundResult.refund,
		};
	}
}
