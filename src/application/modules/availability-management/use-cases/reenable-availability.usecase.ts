import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import {
	AvailabilityNotFoundError,
	UnauthorizedAvailabilityActionError,
} from "../../booking-management/errors/booking.errors";
import type { ReenableAvailabilityInput } from "../dtos/availability.dto";
import type { IReenableAvailabilityUseCase } from "./reenable-availability.usecase.interface";

@injectable()
export class ReenableAvailabilityUseCase
	implements IReenableAvailabilityUseCase
{
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	async execute(input: ReenableAvailabilityInput): Promise<void> {
		const { availabilityId } = input;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			input.userId,
		);
		const availability =
			await this._availabilityRepository.findById(availabilityId);

		if (!availability) {
			throw new AvailabilityNotFoundError();
		}

		if (availability.mentorId !== mentor.id) {
			throw new UnauthorizedAvailabilityActionError(
				"You are not authorized to re-enable this availability rule",
			);
		}

		await this._availabilityRepository.updateStatus(availabilityId, true);
	}
}
