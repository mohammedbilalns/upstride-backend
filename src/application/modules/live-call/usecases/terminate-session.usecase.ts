import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import { UnauthorizedError } from "../../authentication/errors";
import type { TerminateSessionInput } from "../dtos/terminate-session.dto";
import type { ITerminateSessionUseCase } from "./terminate-session.usecase.interface";

@injectable()
export class TerminateSessionUseCase implements ITerminateSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(input: TerminateSessionInput): Promise<void> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new Error("Booking not found");
		}

		if (booking.mentorUserId !== input.userId) {
			throw new UnauthorizedError(
				"You are not authorized to terminate this session",
			);
		}

		const now = new Date();
		const end = new Date(booking.endTime);
		const diffMins = Math.abs((now.getTime() - end.getTime()) / 1000 / 60);

		if (diffMins <= 5 && booking.status !== "COMPLETED") {
			await this._bookingRepository.updateById(booking.id, {
				status: "COMPLETED",
			});
			logger.info(`Booking ${booking.id} marked as  complete on termination.`);
		}
	}
}
