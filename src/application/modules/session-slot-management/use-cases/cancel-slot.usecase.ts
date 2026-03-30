import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	CancelSlotInput,
	CancelSlotResponse,
} from "../dtos/session-slots.dto";
import { SlotNotFoundError } from "../errors";
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
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
		);

		const slot = await this._slotRepository.findById(slotId);
		if (!slot || slot.mentorId !== mentor.id) {
			throw new SlotNotFoundError();
		}

		const updated = slot.transitionTo("blocked");
		await this._slotRepository.updateById(slotId, {
			status: updated.status,
		});

		return { slotId, status: "blocked" };
	}
}
