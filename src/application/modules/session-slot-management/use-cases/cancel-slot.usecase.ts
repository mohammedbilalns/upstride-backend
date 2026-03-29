import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	CancelSlotInput,
	CancelSlotResponse,
} from "../dtos/session-slots.dto";
import { CannotCancelBookedSlotError, SlotNotFoundError } from "../errors";
import type { ICancelSlotUseCase } from "./cancel-slot.usecase.interface";

@injectable()
export class CancelSlotUseCase implements ICancelSlotUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
