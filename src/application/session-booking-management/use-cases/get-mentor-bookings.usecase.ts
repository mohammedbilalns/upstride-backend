import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionBookingRepository } from "../../../domain/repositories/session-booking.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { NotFoundError } from "../../shared/errors/not-found-error";
import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/get-bookings.dto";
import { SessionBookingDtoMapper } from "../mappers/session-booking.mapper";
import type { IGetMentorBookingsUseCase } from "./get-mentor-bookings.usecase.interface";

@injectable()
export class GetMentorBookingsUseCase implements IGetMentorBookingsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
	) {}

	async execute({
		userId,
		filter,
		page,
		limit,
	}: GetBookingsInput): Promise<GetBookingsResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new NotFoundError("Mentor profile not found");
		}

		const result = await this._bookingRepository.paginateByMentor(
			mentor.id,
			filter,
			page,
			limit,
			mentor.userId,
		);

		const mentorProfile = await this._mentorRepository.findProfileById(
			mentor.id,
		);
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
