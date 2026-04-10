import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import {
	AvailabilityNotFoundError,
	UnauthorizedAvailabilityActionError,
} from "../../booking-management/errors/booking.errors";
import type {
	CheckAndReenableAvailabilityResponse,
	ReenableAvailabilityInput,
} from "../dtos/availability.dto";
import { AvailabilityUsecaseMapper } from "../mappers/availability-usecase.mapper";
import { isAvailabilityConflict } from "../utils/availability-conflict.util";
import type { ICheckAndReenableAvailabilityUseCase } from "./check-and-reenable-availability.usecase.interface";

@injectable()
export class CheckAndReenableAvailabilityUseCase
	implements ICheckAndReenableAvailabilityUseCase
{
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	async execute(
		input: ReenableAvailabilityInput,
	): Promise<CheckAndReenableAvailabilityResponse> {
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

		if (availability.status) {
			return { enabled: true };
		}

		const existing = await this._availabilityRepository.findByMentorId(
			mentor.id,
			{ status: true },
		);

		const conflicts = existing.filter(
			(rule) =>
				rule.id !== availability.id &&
				isAvailabilityConflict(availability, rule),
		);

		if (conflicts.length > 0) {
			return {
				enabled: false,
				conflicts: AvailabilityUsecaseMapper.toConflictSummaries(conflicts),
			};
		}

		await this._availabilityRepository.updateStatus(availabilityId, true);
		return { enabled: true };
	}
}
