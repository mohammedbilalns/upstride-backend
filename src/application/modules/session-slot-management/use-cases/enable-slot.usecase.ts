import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	EnableSlotInput,
	EnableSlotResponse,
} from "../dtos/session-slots.dto";
import { CannotEnableBookedSlotError } from "../errors/cannot-enable-booked-slot.error";
import { SlotNotFoundError } from "../errors/slot-not-found.error";
import type { IEnableSlotUseCase } from "./enable-slot.usecase.interface";

@injectable()
export class EnableSlotUseCase implements IEnableSlotUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
	) {}

	async execute({
		userId,
		slotId,
	}: EnableSlotInput): Promise<EnableSlotResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		const slot = await this._slotRepository.findById(slotId);
		if (!slot || slot.mentorId !== mentor.id) {
			throw new SlotNotFoundError();
		}

		if (slot.status === "booked") {
			throw new CannotEnableBookedSlotError();
		}

		await this._slotRepository.updateById(slotId, {
			status: "available",
		});

		return { slotId, status: "available" };
	}
}
