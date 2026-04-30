import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors";
import { UnauthorizedError } from "../../authentication/errors";
import { BookingNotFoundError } from "../../booking/errors/booking.errors";
import type { CreateFeedbackInput } from "../dtos/feedback.dto";
import type { ICreateFeedbackUseCase } from "./create-feedback.use-case.interface";

@injectable()
export class CreateFeedbackUseCase implements ICreateFeedbackUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(input: CreateFeedbackInput): Promise<void> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) throw new BookingNotFoundError();
		if (booking.mentorUserId !== input.mentorId) throw new UnauthorizedError();

		if (booking.status !== "COMPLETED") {
			throw new ValidationError(
				`Cannot create feedback before completing the call`,
			);
		}

		await this._bookingRepository.updateById(input.bookingId, {
			feedback: input.feedback,
		});
	}
}
