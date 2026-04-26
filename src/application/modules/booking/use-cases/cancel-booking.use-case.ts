import { inject, injectable } from "inversify";
import { Booking } from "../../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors";
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
import type { ICancelBookingUseCase } from "./cancel-booking.use-case.interface";
import type { IRefundSessionAmountUseCase } from "./refund-session-amount.use-case.interface";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.UseCases.RefundSessionAmount)
		private readonly _refundSessionAmountUseCase: IRefundSessionAmountUseCase,
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(input: CancelBookingInput): Promise<CancelBookingResponse> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (booking.menteeId !== input.userId) {
			throw new UnauthorizedBookingActionError();
		}

		if (
			booking.status === "CANCELLED_BY_MENTEE" ||
			booking.status === "CANCELLED_BY_MENTOR"
		) {
			throw new BookingAlreadyCancelledError();
		}

		if (booking.paymentStatus === "PENDING") {
			throw new ValidationError(
				"Cannot cancel a booking while payment is pending.",
			);
		}

		Booking.assertCancellable(booking.status);

		await this._bookingRepository.updateById(input.bookingId, {
			status: "CANCELLED_BY_MENTEE",
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
			cancelledBy: "user",
		});

		if (booking.mentorUserId) {
			await this._createNotificationUseCase.execute({
				userId: booking.mentorUserId,
				actorId: input.userId,
				relatedEntityId: booking.id,
				title: "Session Cancelled",
				description:
					refundResult.refund.amount > 0
						? `A mentee cancelled booking ${booking.id}. Refund to the mentee: ${refundResult.refund.amount} coins (${refundResult.refund.percentage}%).`
						: `A mentee cancelled booking ${booking.id}. No refund was issued.`,
				type: "SESSION",
				event: "SESSION_CANCELLED",
				metadata: {
					bookingId: booking.id,
					cancelledBy: "mentee",
					cancellationReason: input.reason || "None provided",
					refundAmount: refundResult.refund.amount,
					refundPercentage: refundResult.refund.percentage,
					refundReason: refundResult.refund.reason,
					paymentType: booking.paymentType,
					paymentStatus: booking.paymentStatus,
				},
			});
		}

		return {
			bookingId: booking.id,
			status: "CANCELLED_BY_MENTEE",
			refund: refundResult.refund,
		};
	}
}
