import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import { buildPaginationMeta } from "../../../shared/utilities/pagination.util";
import type {
	GetMentorAvailabilitiesInput,
	GetMentorAvailabilitiesResponse,
} from "../dtos/availability.dto";
import { AvailabilityMapper } from "../mappers/availability.mapper";
import type { IGetMentorAvailabilitiesUseCase } from "./get-mentor-availabilities.use-case.interface";

@injectable()
export class GetMentorAvailabilitiesUseCase
	implements IGetMentorAvailabilitiesUseCase
{
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	async execute(
		input: GetMentorAvailabilitiesInput,
	): Promise<GetMentorAvailabilitiesResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);
		const status =
			input.status === "active"
				? true
				: input.status === "disabled"
					? false
					: undefined;
		const page = input.page ?? 1;
		const limit = input.limit ?? 0;

		let mentorIdToQuery = mentor.id;
		let availabilities = await this._availabilityRepository.findByMentorId(
			mentorIdToQuery,
			{
				status,
				expired: input.expired,
				page,
				limit,
			},
		);

		if (
			availabilities.length === 0 &&
			mentor.userId &&
			mentor.userId !== mentor.id
		) {
			const legacyAvailabilities =
				await this._availabilityRepository.findByMentorId(mentor.userId, {
					status,
					expired: input.expired,
					page,
					limit,
				});

			if (legacyAvailabilities.length > 0) {
				mentorIdToQuery = mentor.userId;
				availabilities = legacyAvailabilities;
			}
		}

		let pagination: GetMentorAvailabilitiesResponse["pagination"] | undefined;
		if (limit > 0) {
			const totalCount = await this._availabilityRepository.countByMentorId(
				mentorIdToQuery,
				{ status, expired: input.expired },
			);
			pagination = buildPaginationMeta(page, limit, totalCount, 1);
		}

		return {
			availabilities: AvailabilityMapper.toDtos(availabilities),
			pagination,
		};
	}
}
