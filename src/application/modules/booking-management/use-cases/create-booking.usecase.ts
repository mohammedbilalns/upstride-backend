import { inject, injectable } from "inversify";
import { Booking } from "../../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	CreateBookingInput,
	CreateBookingResponse,
} from "../dtos/booking.dto";
import { SlotNotAvailableError } from "../errors/booking.errors";
import type { ICreateBookingUseCase } from "./create-booking.usecase.interface";

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(input: CreateBookingInput): Promise<CreateBookingResponse> {
		Booking.assertCanBook(input.menteeId, input.mentorId);

		const validationData = Booking.create({
			menteeId: input.menteeId,
			mentorId: input.mentorId,
			startTime: input.startTime,
			endTime: input.endTime,
			meetingLink: "Pending",
			notes: input.notes,
		});

		const overlap = await this._bookingRepository.findOverlapping(
			input.mentorId,
			new Date(input.startTime),
			new Date(input.endTime),
		);

		if (overlap.length > 0) {
			throw new SlotNotAvailableError();
		}

		const createdBooking = await this._bookingRepository.create({
			menteeId: validationData.menteeId,
			mentorId: validationData.mentorId,
			startTime: validationData.startTime,
			endTime: validationData.endTime,
			status: "PENDING",
			meetingLink: validationData.meetingLink,
			notes: validationData.notes || null,
		} as any);

		return { bookingId: createdBooking.id };
	}
}
