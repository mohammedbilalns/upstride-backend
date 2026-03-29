import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type { IRefundService } from "../../payments/services/refund.service.interface";
import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/session-booking.dto";
import { BookingCannotBeCancelledError } from "../errors";
import {
	getBookingForMentorOrThrow,
	releaseSlotOrThrow,
} from "../utils/booking.util";
import type { ICancelBookingByMentorUseCase } from "./cancel-booking-by-mentor.usecase.interface";

@injectable()
export class CancelBookingByMentorUseCase
	implements ICancelBookingByMentorUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Services.RefundService)
		private readonly _refundService: IRefundService,
	) {}

	async execute({
		userId,
		bookingId,
		reason,
	}: CancelBookingInput): Promise<CancelBookingResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
			"Mentor profile not found",
		);

		const booking = await getBookingForMentorOrThrow(
			this._bookingRepository,
			bookingId,
			mentor.id,
		);

		if (
			booking.status === "cancelled" ||
			booking.status === "refunded" ||
			booking.status === "completed"
		) {
			throw new BookingCannotBeCancelledError();
		}

		await this._bookingRepository.updateById(bookingId, {
			status: "cancelled",
			cancellationReason: reason,
			cancelledBy: "mentor",
			updatedAt: new Date(),
		});

		await releaseSlotOrThrow(this._slotRepository, booking.slotId);

		const refundAmount = booking.price;

		await this._refundService.processRefund({
			bookingId: booking.id,
			userId: booking.userId,
			refundAmount,
			cancelledBy: "mentor",
		});

		return { bookingId, status: "cancelled" };
	}
}
