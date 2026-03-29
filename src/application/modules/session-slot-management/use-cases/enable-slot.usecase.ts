import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	EnableSlotInput,
	EnableSlotResponse,
} from "../dtos/session-slots.dto";
import { SlotNotFoundError } from "../errors";
import { CannotEnableBookedSlotError } from "../errors/cannot-enable-booked-slot.error";
import type { IEnableSlotUseCase } from "./enable-slot.usecase.interface";

@injectable()
export class EnableSlotUseCase implements IEnableSlotUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
