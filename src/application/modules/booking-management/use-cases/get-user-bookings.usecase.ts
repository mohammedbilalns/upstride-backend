import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
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

		return {
			items: result.items.map((b) => BookingUsecaseMapper.toDto(b)),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
