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
		const availabilities = await this._availabilityRepository.findByMentorId(
			input.mentorId,
			{
				activeOnly: input.expired === undefined || input.expired === false,
				expired: input.expired,
			},
		);

		return {
			availabilities: AvailabilityUsecaseMapper.toDtos(availabilities),
		};
	}
}
