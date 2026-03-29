import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	DeleteSlotInput,
	DeleteSlotResponse,
} from "../dtos/session-slots.dto";
import { SlotNotFoundError } from "../errors";
import { CannotCancelBookedSlotError } from "../errors/cannot-canell-booked-slot.error";
import type { IDeleteSlotUseCase } from "./delete-slot.usecase.interface";

@injectable()
export class DeleteSlotUseCase implements IDeleteSlotUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
	) {}

	async execute({
		userId,
		slotId,
	}: DeleteSlotInput): Promise<DeleteSlotResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
		);

		const slot = await this._slotRepository.findById(slotId);
		if (!slot || slot.mentorId !== mentor.id) {
			throw new SlotNotFoundError();
		}

		if (slot.status === "booked") {
			throw new CannotCancelBookedSlotError("Booked slot cannot be deleted");
		}

		await this._slotRepository.deleteById(slotId);

		return { slotId };
	}
}
