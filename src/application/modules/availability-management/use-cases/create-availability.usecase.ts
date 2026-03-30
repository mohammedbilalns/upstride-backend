import { inject, injectable } from "inversify";
import type {
	Day,
	SlotDuration,
} from "../../../../domain/entities/availability.entity";
import { Availability } from "../../../../domain/entities/availability.entity";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
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
	) {}

	async execute(
		input: CreateAvailabilityInput,
	): Promise<CreateAvailabilityResponse> {
		const validated = Availability.create({
			mentorId: input.mentorId,
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
