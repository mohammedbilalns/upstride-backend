import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetBookingDetailsInput,
	GetBookingDetailsResponse,
} from "../dtos/booking.dto";
import { BookingNotFoundError } from "../errors/booking.errors";
import { BookingUsecaseMapper } from "../mappers/booking-usecase.mapper";
import type { IGetBookingDetailsUseCase } from "./get-booking-details.usecase.interface";

@injectable()
export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(
		input: GetBookingDetailsInput,
	): Promise<GetBookingDetailsResponse> {
		const booking = await this._bookingRepository.findById(input.bookingId);
		if (!booking || booking.menteeId !== input.userId) {
			throw new BookingNotFoundError();
		}

		return { booking: BookingUsecaseMapper.toDto(booking) };
	}
}
