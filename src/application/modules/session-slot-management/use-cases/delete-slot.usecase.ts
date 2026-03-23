import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	DeleteSlotInput,
	DeleteSlotResponse,
} from "../dtos/session-slots.dto";
import { CannotCancelBookedSlotError } from "../errors/cannot-canell-booked-slot.error";
import { SlotNotFoundError } from "../errors/slot-not-found.error";
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
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

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
