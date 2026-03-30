import { inject, injectable } from "inversify";
import { Availability } from "../../../../domain/entities/availability.entity";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	CheckAndCreateAvailabilityResponse,
	CreateAvailabilityInput,
} from "../dtos/availability.dto";
import { AvailabilityUsecaseMapper } from "../mappers/availability-usecase.mapper";
import { isAvailabilityConflict } from "../utils/availability-conflict.util";
import type { ICheckAndCreateAvailabilityUseCase } from "./check-and-create-availability.usecase.interface";
import type { ICreateAvailabilityUseCase } from "./create-availability.usecase.interface";

@injectable()
export class CheckAndCreateAvailabilityUseCase
	implements ICheckAndCreateAvailabilityUseCase
{
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.UseCases.CreateAvailability)
		private readonly _createAvailabilityUseCase: ICreateAvailabilityUseCase,
	) {}

	async execute(
		input: CreateAvailabilityInput,
	): Promise<CheckAndCreateAvailabilityResponse> {
		const candidate = Availability.create({
			mentorId: input.mentorId,
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
			input.mentorId,
			{ status: true },
		);

		const conflicts = existing.filter((rule) =>
			isAvailabilityConflict(candidate, rule),
		);

		if (conflicts.length > 0) {
			return {
				created: false,
				conflicts: AvailabilityUsecaseMapper.toConflictSummaries(conflicts),
			};
		}

		const created = await this._createAvailabilityUseCase.execute(input);
		const createdAvailability = await this._availabilityRepository.findById(
			created.availabilityId,
		);

		return {
			created: true,
			availability: createdAvailability
				? AvailabilityUsecaseMapper.toDto(createdAvailability)
				: undefined,
		};
	}

	// conflict logic moved to utils
}
