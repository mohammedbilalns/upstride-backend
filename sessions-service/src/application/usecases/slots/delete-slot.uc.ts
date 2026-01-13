import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IDeleteSlotUC } from "../../../domain/useCases/slots/delete-slot.uc.interface";
import { DeleteSlotDto } from "../../dtos/slot.dto";

import { AppError } from "../../errors/app-error";

export class DeleteSlotUC implements IDeleteSlotUC {
	constructor(private _slotRepository: ISlotRepository) {}

	async execute(dto: DeleteSlotDto): Promise<void> {
		const existingSlot = await this._slotRepository.findById(dto.slotId);
		// check if the slot exists
		if (!existingSlot)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);

		// check if the slot belongs to the mentor
		if (existingSlot.mentorId !== dto.mentorId)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);

		// Check if slot is booked (status not OPEN and not CANCELLED usually implies booked, or check participantId)
		// If status is FULL, STARTED, COMPLETED, it is booked.
		if (
			existingSlot.status === "FULL" ||
			existingSlot.status === "STARTED" ||
			existingSlot.status === "COMPLETED" ||
			existingSlot.participantId
		) {
			throw new AppError("Cannot delete a booked slot", HttpStatus.BAD_REQUEST);
		}

		await this._slotRepository.delete(existingSlot.id);
	}
}
