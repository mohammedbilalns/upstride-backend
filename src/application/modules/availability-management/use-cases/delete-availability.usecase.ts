import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { DeleteAvailabilityInput } from "../dtos/availability.dto";
import { AvailabilityNotFoundError } from "../errors/availability-not-found.error";
import type { IDeleteAvailabilityUseCase } from "./delete-availability.usecase.interface";

@injectable()
export class DeleteAvailabilityUseCase implements IDeleteAvailabilityUseCase {
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
	) {}

	async execute(input: DeleteAvailabilityInput): Promise<void> {
		const existing = await this._availabilityRepository.findById(
			input.availabilityId,
		);
		if (!existing || existing.mentorId !== input.mentorId) {
			throw new AvailabilityNotFoundError();
		}

		await this._availabilityRepository.deleteById(input.availabilityId);
	}
}
