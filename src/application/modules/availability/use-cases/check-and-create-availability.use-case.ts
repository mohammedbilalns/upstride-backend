import { inject, injectable } from "inversify";
import { Availability } from "../../../../domain/entities/availability.entity";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	CheckAndCreateAvailabilityResponse,
	CreateAvailabilityInput,
} from "../dtos/availability.dto";
import { AvailabilityMapper } from "../mappers/availability.mapper";
import { isAvailabilityConflict } from "../utils/availability-conflict.util";
import type { ICheckAndCreateAvailabilityUseCase } from "./check-and-create-availability.use-case.interface";
import type { ICreateAvailabilityUseCase } from "./create-availability.use-case.interface";

@injectable()
export class CheckAndCreateAvailabilityUseCase
	implements ICheckAndCreateAvailabilityUseCase
{
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
		@inject(TYPES.UseCases.CreateAvailability)
		private readonly _createAvailabilityUseCase: ICreateAvailabilityUseCase,
	) {}

	async execute(
		input: CreateAvailabilityInput,
	): Promise<CheckAndCreateAvailabilityResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);
		const candidate = Availability.create({
			mentorId: mentor.id,
			name: input.name,
			description: input.description,
			days: new Set(input.days),
			startTime: input.startTime,
			endTime: input.endTime,
			startDate: input.startDate,
			endDate: input.endDate,
			breakTimes: input.breakTimes,
			slotDuration: input.slotDuration,
			bufferTime: input.bufferTime,
			status: true,
		});

		const existing = await this._availabilityRepository.findByMentorId(
			mentor.id,
			{ status: true },
		);

		const conflicts = existing.filter((rule) =>
			isAvailabilityConflict(candidate, rule),
		);

		if (conflicts.length > 0) {
			return {
				created: false,
				conflicts: AvailabilityMapper.toConflictSummaries(conflicts),
			};
		}

		const created = await this._createAvailabilityUseCase.execute(input);
		const createdAvailability = await this._availabilityRepository.findById(
			created.availabilityId,
		);

		return {
			created: true,
			availability: createdAvailability
				? AvailabilityMapper.toDto(createdAvailability)
				: undefined,
		};
	}
}
