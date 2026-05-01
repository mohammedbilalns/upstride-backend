import { inject, injectable } from "inversify";
import { Availability } from "../../../../domain/entities/availability.entity";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	CheckAndUpdateAvailabilityResponse,
	UpdateAvailabilityInput,
} from "../dtos/availability.dto";
import { AvailabilityNotFoundError } from "../errors/availability-not-found.error";
import { AvailabilityMapper } from "../mappers/availability.mapper";
import { isAvailabilityConflict } from "../utils/availability-conflict.util";
import type { ICheckAndUpdateAvailabilityUseCase } from "./check-and-update-availability.use-case.interface";
import type { IUpdateAvailabilityUseCase } from "./update-availability.use-case.interface";

@injectable()
export class CheckAndUpdateAvailabilityUseCase
	implements ICheckAndUpdateAvailabilityUseCase
{
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
		@inject(TYPES.UseCases.UpdateAvailability)
		private readonly _updateAvailabilityUseCase: IUpdateAvailabilityUseCase,
	) {}

	async execute(
		input: UpdateAvailabilityInput,
	): Promise<CheckAndUpdateAvailabilityResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);

		const existingRule = await this._availabilityRepository.findById(
			input.availabilityId,
		);

		if (!existingRule || existingRule.mentorId !== mentor.id) {
			throw new AvailabilityNotFoundError();
		}

		const candidate = Availability.create({
			mentorId: mentor.id,
			name: input.name ?? existingRule.name,
			description: input.description ?? existingRule.description,
			days: input.days ? new Set(input.days) : existingRule.days,
			startTime: input.startTime ?? existingRule.startTime,
			endTime: input.endTime ?? existingRule.endTime,
			startDate: input.startDate ?? existingRule.startDate,
			endDate: input.endDate ?? existingRule.endDate,
			breakTimes: input.breakTimes ?? existingRule.breakTimes,
			slotDuration: input.slotDuration ?? existingRule.slotDuration,
			bufferTime: input.bufferTime ?? existingRule.bufferTime,
			status: input.status ?? existingRule.status,
		});

		const activeRules = await this._availabilityRepository.findByMentorId(
			mentor.id,
			{ status: true },
		);

		const otherRules = activeRules.filter(
			(rule) => rule.id !== input.availabilityId,
		);

		const conflicts = otherRules.filter((rule) =>
			isAvailabilityConflict(candidate, rule),
		);

		if (conflicts.length > 0) {
			return {
				updated: false,
				conflicts: AvailabilityMapper.toConflictSummaries(conflicts),
			};
		}

		await this._updateAvailabilityUseCase.execute(input);

		const updatedAvailability = await this._availabilityRepository.findById(
			input.availabilityId,
		);

		return {
			updated: true,
			availability: updatedAvailability
				? AvailabilityMapper.toDto(updatedAvailability)
				: undefined,
		};
	}
}
