import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type { DeleteAvailabilityInput } from "../dtos/availability.dto";
import { AvailabilityNotFoundError } from "../errors/availability-not-found.error";
import type { IDeleteAvailabilityUseCase } from "./delete-availability.use-case.interface";

@injectable()
export class DeleteAvailabilityUseCase implements IDeleteAvailabilityUseCase {
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	async execute(input: DeleteAvailabilityInput): Promise<void> {
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

		await this._availabilityRepository.deleteById(input.availabilityId);
	}
}
