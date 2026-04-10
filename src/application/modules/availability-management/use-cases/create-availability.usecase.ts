import { inject, injectable } from "inversify";
import type {
	Day,
	SlotDuration,
} from "../../../../domain/entities/availability.entity";
import { Availability } from "../../../../domain/entities/availability.entity";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	CreateAvailabilityInput,
	CreateAvailabilityResponse,
} from "../dtos/availability.dto";

import type { ICreateAvailabilityUseCase } from "./create-availability.usecase.interface";

@injectable()
export class CreateAvailabilityUseCase implements ICreateAvailabilityUseCase {
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	async execute(
		input: CreateAvailabilityInput,
	): Promise<CreateAvailabilityResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);
		const validated = Availability.create({
			mentorId: mentor.id,
			name: input.name,
			description: input.description,
			days: new Set<Day>(input.days),
			startTime: input.startTime,
			endTime: input.endTime,
			startDate: input.startDate,
			endDate: input.endDate,
			breakTimes: input.breakTimes,
			slotDuration: input.slotDuration as SlotDuration,
			bufferTime: input.bufferTime,
			status: true,
		});

		const created = await this._availabilityRepository.create({
			...validated,
		} as Availability);

		return { availabilityId: created.id };
	}
}
