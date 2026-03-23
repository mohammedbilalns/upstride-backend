import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	CancelSlotInput,
	CancelSlotResponse,
} from "../dtos/session-slots.dto";
import { CannotCancelBookedSlotError } from "../errors/cannot-canell-booked-slot.error";
import { SlotNotFoundError } from "../errors/slot-not-found.error";
import type { ICancelSlotUseCase } from "./cancel-slot.usecase.interface";

@injectable()
export class CancelSlotUseCase implements ICancelSlotUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
	) {}

	async execute({
		userId,
		slotId,
	}: CancelSlotInput): Promise<CancelSlotResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		const slot = await this._slotRepository.findById(slotId);
		if (!slot || slot.mentorId !== mentor.id) {
			throw new SlotNotFoundError();
		}

		if (slot.status === "booked") {
			throw new CannotCancelBookedSlotError();
		}

		await this._slotRepository.updateById(slotId, {
			status: "blocked",
		});

		return { slotId, status: "blocked" };
	}
}
