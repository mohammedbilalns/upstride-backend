import { inject, injectable } from "inversify";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/get-bookings.dto";
import { SessionBookingDtoMapper } from "../mappers/session-booking.mapper";
import type { IGetMentorBookingsUseCase } from "./get-mentor-bookings.usecase.interface";

@injectable()
export class GetMentorBookingsUseCase implements IGetMentorBookingsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
	) {}

	async execute({
		userId,
		filter,
		page,
		limit,
	}: GetBookingsInput): Promise<GetBookingsResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
			"Mentor profile not found",
		);

		const result = await this._bookingRepository.paginateByMentor(
			mentor.id,
			filter,
			page,
			limit,
			mentor.userId,
		);

		const mentorProfile =
			await this._mentorProfileReadRepository.findProfileById(mentor.id);
		const mentorNames = new Map<string, string>();
		if (mentorProfile) {
			mentorNames.set(mentorProfile.id, mentorProfile.user.name);
		}

		return {
			...result,
			items: SessionBookingDtoMapper.toListItems(result.items, mentorNames),
		};
	}
}
