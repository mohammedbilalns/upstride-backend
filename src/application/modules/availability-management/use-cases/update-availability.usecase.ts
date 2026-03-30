import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	UpdateAvailabilityInput,
	UpdateAvailabilityResponse,
} from "../dtos/availability.dto";
import { AvailabilityNotFoundError } from "../errors/availability-not-found.error";

import type { IUpdateAvailabilityUseCase } from "./update-availability.usecase.interface";

@injectable()
export class UpdateAvailabilityUseCase implements IUpdateAvailabilityUseCase {
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
	) {}

	async execute(
		input: UpdateAvailabilityInput,
	): Promise<UpdateAvailabilityResponse> {
		const existing = await this._availabilityRepository.findById(
			input.availabilityId,
		);
		if (!existing || existing.mentorId !== input.mentorId) {
			throw new AvailabilityNotFoundError();
		}

		const updated = await this._availabilityRepository.updateById(
			input.availabilityId,
			{
				...(input.name !== undefined && { name: input.name }),
				...(input.description !== undefined && {
					description: input.description,
				}),
				...(input.days !== undefined && { days: new Set(input.days) }),
				...(input.startTime !== undefined && { startTime: input.startTime }),
				...(input.endTime !== undefined && { endTime: input.endTime }),
				...(input.startDate !== undefined && { startDate: input.startDate }),
				...(input.endDate !== undefined && { endDate: input.endDate }),
				...(input.breakTimes !== undefined && {
					breakTimes: input.breakTimes,
				}),
				...(input.slotDuration !== undefined && {
					slotDuration: input.slotDuration,
				}),
				...(input.bufferTime !== undefined && {
					bufferTime: input.bufferTime,
				}),
				...(input.priority !== undefined && { priority: input.priority }),
				...(input.status !== undefined && { status: input.status }),
			},
		);

		if (!updated) throw new AvailabilityNotFoundError();
		return { availabilityId: updated.id };
	}
}
