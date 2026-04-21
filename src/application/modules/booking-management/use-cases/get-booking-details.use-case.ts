import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getClientBaseUrl } from "../../../../shared/utilities/url.util";
import type {
	GetBookingDetailsInput,
	GetBookingDetailsResponse,
} from "../dtos/booking.dto";
import { BookingNotFoundError } from "../errors/booking.errors";
import { BookingMapper } from "../mappers/booking.mapper";
import type { IGetBookingDetailsUseCase } from "./get-booking-details.use-case.interface";

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
		if (
			!booking ||
			(booking.menteeId !== input.userId &&
				booking.mentorUserId !== input.userId)
		) {
			throw new BookingNotFoundError();
		}

		let meetingLink = booking.meetingLink;
		if (
			booking.paymentStatus === "COMPLETED" &&
			(!booking.meetingLink || booking.meetingLink === "Pending")
		) {
			meetingLink = `${getClientBaseUrl()}/call/${booking.id}`;
			await this._bookingRepository.updateById(booking.id, { meetingLink });
		}

		const dto = BookingMapper.toDto(booking);
		dto.meetingLink = meetingLink;

		return { booking: dto };
	}
}
