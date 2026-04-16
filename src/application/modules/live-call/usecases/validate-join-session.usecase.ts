import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { UnauthorizedError } from "../../authentication/errors";
import {
	BookingNotFoundError,
	SessionTooEarlyError,
} from "../../booking-management/errors/booking.errors";
import type { JoinSessionInput } from "../dtos/join-session.dto";
import type { IValidateJoinSessionUseCase } from "./validate-join-session.usecase.interface";

@injectable()
export class ValidateJoinSessionUseCase implements IValidateJoinSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private _bookingRepository: IBookingRepository,
	) {}

	async execute(input: JoinSessionInput): Promise<void> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (
			booking.mentorUserId !== input.userId &&
			booking.menteeId !== input.userId
		) {
			throw new UnauthorizedError(
				"You are not authorized to join this session",
			);
		}

		// Block joining if payment is PENDING
		if (booking.status === "PENDING") {
			throw new UnauthorizedError(
				"Payment is pending for this session. Please complete payment before joining.",
			);
		}

		//	Restrict joining until 5 minutes before start time
		const now = Date.now();
		const startTime = new Date(booking.startTime).getTime();
		const JOIN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

		if (now < startTime - JOIN_WINDOW_MS) {
			throw new SessionTooEarlyError();
		}
	}
}
