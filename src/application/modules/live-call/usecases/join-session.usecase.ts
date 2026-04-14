import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { UnauthorizedError } from "../../authentication/errors";
import { BookingNotFoundError } from "../../booking-management/errors/booking.errors";
import type {
	JoinSessionInput,
	JoinSessionOutput,
} from "../dtos/join-session.dto";
import type { IJoinSessionUseCase } from "./join-session.usecase.interface";

@injectable()
export class JoinSessionUseCase implements IJoinSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private _bookingRepository: IBookingRepository,
	) {}
	async execute(input: JoinSessionInput): Promise<JoinSessionOutput> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new BookingNotFoundError();
		}

		// TODO: validate Date and time too in here
		if (input.userId !== booking.mentorUserId || booking.menteeId) {
			throw new UnauthorizedError(
				"You are not authorized to join this session",
			);
		}
		return { roomId: booking.id };
	}
}
