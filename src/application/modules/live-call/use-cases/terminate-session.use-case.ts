import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors/validation-error";
import { UnauthorizedError } from "../../authentication/errors";
import { BookingNotFoundError } from "../../booking/errors/booking.errors";
import type { TerminateSessionInput } from "../dtos/terminate-session.dto";
import type { ITerminateSessionUseCase } from "./terminate-session.use-case.interface";

@injectable()
export class TerminateSessionUseCase implements ITerminateSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(input: TerminateSessionInput): Promise<void> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (!this._isHostingMentor(booking.mentorUserId, input.userId)) {
			throw new UnauthorizedError(
				"You are not authorized to terminate this session",
			);
		}

		const now = new Date();
		const end = new Date(booking.endTime);
		const ONE_MINUTE_IN_MS = 60 * 1000;
		const terminationAllowedAfter = new Date(end.getTime() - ONE_MINUTE_IN_MS);

		if (now < terminationAllowedAfter) {
			const waitMins = Math.ceil(
				(terminationAllowedAfter.getTime() - now.getTime()) / 1000 / 60,
			);
			throw new ValidationError(
				`You can only terminate the session in the last minute or after it has ended. Please wait ${waitMins} more minute(s).`,
			);
		}

		if (booking.status !== "COMPLETED") {
			const update: {
				status: "COMPLETED";
				mentorJoinedAt?: Date;
			} = {
				status: "COMPLETED",
			};
			if (!booking.mentorJoinedAt) {
				update.mentorJoinedAt = now;
			}
			await this._bookingRepository.updateById(booking.id, {
				...update,
			});
			logger.info(`Booking ${booking.id} marked as complete on termination.`);
		}
	}

	private _isHostingMentor(
		mentorUserId: string | null,
		userId: string,
	): boolean {
		return mentorUserId === userId;
	}
}
