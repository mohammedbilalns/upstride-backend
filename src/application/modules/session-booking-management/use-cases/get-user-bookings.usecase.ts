import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/get-bookings.dto";
import { SessionBookingDtoMapper } from "../mappers/session-booking.mapper";
import type { IGetUserBookingsUseCase } from "./get-user-bookings.usecase.interface";

@injectable()
export class GetUserBookingsUseCase implements IGetUserBookingsUseCase {
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
		const result = await this._bookingRepository.paginateByUser(
			userId,
			filter,
			page,
			limit,
		);

		const mentorIds = Array.from(
			new Set(result.items.map((item) => item.mentorId)),
		);
		const mentorProfiles = await Promise.all(
			mentorIds.map((mentorId) =>
				this._mentorRepository.findProfileById(mentorId),
			),
		);
		const mentorNames = new Map<string, string>();
		for (const profile of mentorProfiles) {
			if (profile) {
				mentorNames.set(profile.id, profile.user.name);
			}
		}

		return {
			...result,
			items: SessionBookingDtoMapper.toListItems(result.items, mentorNames),
		};
	}
}
