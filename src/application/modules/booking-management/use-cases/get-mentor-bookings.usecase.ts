import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/booking.dto";
import { buildBookingListResponse } from "../utils/booking-list.util";
import type { IGetMentorBookingsUseCase } from "./get-mentor-bookings.usecase.interface";

@injectable()
export class GetMentorBookingsUseCase implements IGetMentorBookingsUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	async execute(input: GetBookingsInput): Promise<GetBookingsResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);
		const page = input.page || 1;
		const limit = input.limit || 10;
		const filter = input.filter || "all";

		const result = await this._bookingRepository.paginateByMentor(
			mentor.id,
			filter,
			page,
			limit,
		);
		return buildBookingListResponse(this._bookingRepository, result);
	}
}
