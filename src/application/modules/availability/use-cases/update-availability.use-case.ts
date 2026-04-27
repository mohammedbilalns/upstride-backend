import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	UpdateAvailabilityInput,
	UpdateAvailabilityResponse,
} from "../dtos/availability.dto";
import { AvailabilityNotFoundError } from "../errors/availability-not-found.error";

import type { IUpdateAvailabilityUseCase } from "./update-availability.use-case.interface";

@injectable()
export class UpdateAvailabilityUseCase implements IUpdateAvailabilityUseCase {
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	async execute(
		input: UpdateAvailabilityInput,
	): Promise<UpdateAvailabilityResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);
		const existing = await this._availabilityRepository.findById(
			input.availabilityId,
		);
		if (!existing || existing.mentorId !== mentor.id) {
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
				...(input.status !== undefined && { status: input.status }),
			},
		);

		if (!updated) throw new AvailabilityNotFoundError();
		return { availabilityId: updated.id };
	}
}
