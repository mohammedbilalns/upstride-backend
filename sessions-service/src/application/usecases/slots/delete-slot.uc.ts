import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IDeleteSlotUC } from "../../../domain/useCases/slots/delete-slot.uc.interface";
import { DeleteSlotDto } from "../../dtos/slot.dto";

import { AppError } from "../../errors/app-error";
import { SlotStatus } from "../../../domain/entities/slot.entity";

export class DeleteSlotUC implements IDeleteSlotUC {
	constructor(private _slotRepository: ISlotRepository) { }

	/**
	 * Deletes a slot.
	 * Verifies that the slot is not already booked before deleting.
	 */
	async execute(dto: DeleteSlotDto): Promise<void> {
		const existingSlot = await this._slotRepository.findById(dto.slotId);
		// check if the slot exists
		if (!existingSlot)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);

		// check if the slot belongs to the mentor
		if (existingSlot.mentorId !== dto.mentorId)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);


		if (existingSlot.status !== SlotStatus.OPEN || existingSlot.participantId) {
			throw new AppError(
				"Cannot delete a slot that is booked or reserved",
				HttpStatus.BAD_REQUEST,
			);
		}

		await this._slotRepository.delete(existingSlot.id);
	}
}
