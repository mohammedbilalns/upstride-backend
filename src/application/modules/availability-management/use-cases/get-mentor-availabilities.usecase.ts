import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetMentorAvailabilitiesInput,
	GetMentorAvailabilitiesResponse,
} from "../dtos/availability.dto";
import { AvailabilityUsecaseMapper } from "../mappers/availability-usecase.mapper";
import type { IGetMentorAvailabilitiesUseCase } from "./get-mentor-availabilities.usecase.interface";

@injectable()
export class GetMentorAvailabilitiesUseCase
	implements IGetMentorAvailabilitiesUseCase
{
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
	) {}

	async execute(
		input: GetMentorAvailabilitiesInput,
	): Promise<GetMentorAvailabilitiesResponse> {
		const status =
			input.status === "active"
				? true
				: input.status === "disabled"
					? false
					: undefined;
		const page = input.page ?? 1;
		const limit = input.limit ?? 0;

		const availabilities = await this._availabilityRepository.findByMentorId(
			input.mentorId,
			{
				status,
				expired: input.expired,
				page,
				limit,
			},
		);

		let pagination: GetMentorAvailabilitiesResponse["pagination"] | undefined;
		if (limit > 0) {
			const totalCount = await this._availabilityRepository.countByMentorId(
				input.mentorId,
				{ status, expired: input.expired },
			);
			const totalPages = Math.max(1, Math.ceil(totalCount / limit));
			pagination = {
				page,
				limit,
				totalPages,
				totalCount,
			};
		}

		return {
			availabilities: AvailabilityUsecaseMapper.toDtos(availabilities),
			pagination,
		};
	}
}
