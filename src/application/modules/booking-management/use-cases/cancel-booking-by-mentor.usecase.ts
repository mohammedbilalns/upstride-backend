import { inject, injectable } from "inversify";
import { Booking } from "../../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/booking.dto";
import {
	BookingAlreadyCancelledError,
	BookingNotFoundError,
	UnauthorizedBookingActionError,
} from "../errors/booking.errors";
import type { ICancelBookingByMentorUseCase } from "./cancel-booking-by-mentor.usecase.interface";

@injectable()
export class CancelBookingByMentorUseCase
	implements ICancelBookingByMentorUseCase
{
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(input: CancelBookingInput): Promise<CancelBookingResponse> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (booking.mentorId !== input.userId) {
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

		return {
			bookingId: booking.id,
			status: "CANCELLED_BY_MENTOR",
		};
	}
}
