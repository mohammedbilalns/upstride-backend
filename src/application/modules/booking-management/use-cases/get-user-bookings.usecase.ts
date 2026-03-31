import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getClientBaseUrl } from "../../../../shared/utilities/url.util";
import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/booking.dto";
import { BookingUsecaseMapper } from "../mappers/booking-usecase.mapper";
import type { IGetUserBookingsUseCase } from "./get-user-bookings.usecase.interface";

@injectable()
export class GetUserBookingsUseCase implements IGetUserBookingsUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(input: GetBookingsInput): Promise<GetBookingsResponse> {
		const page = input.page || 1;
		const limit = input.limit || 10;
		const filter = input.filter || "all";

		const result = await this._bookingRepository.paginateByMentee(
			input.userId,
			filter,
			page,
			limit,
		);

		const clientBaseUrl = getClientBaseUrl();
		const needsMeetingLink = result.items.filter(
			(booking) =>
				booking.paymentStatus === "COMPLETED" &&
				(!booking.meetingLink || booking.meetingLink === "Pending"),
		);

		if (needsMeetingLink.length > 0) {
			await Promise.all(
				needsMeetingLink.map((booking) =>
					this._bookingRepository.updateById(booking.id, {
						meetingLink: `${clientBaseUrl}/sessions/${booking.id}`,
					}),
				),
			);
		}

		return {
			items: result.items.map((b) => {
				const dto = BookingUsecaseMapper.toDto(b);
				if (
					b.paymentStatus === "COMPLETED" &&
					(!b.meetingLink || b.meetingLink === "Pending")
				) {
					dto.meetingLink = `${clientBaseUrl}/sessions/${b.id}`;
				}
				return dto;
			}),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
