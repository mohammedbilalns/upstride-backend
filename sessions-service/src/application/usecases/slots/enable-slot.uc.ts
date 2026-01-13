import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { ICancleSlotUC } from "../../../domain/useCases/slots/cancel-slot.uc.interface";
import { CancelSlotDto } from "../../dtos/slot.dto";
import { AppError } from "../../errors/app-error";

// Reusing CancelSlotDto since it just needs mentorId and slotId
export class EnableSlotUC implements ICancleSlotUC {
	constructor(private _slotRepository: ISlotRepository) {}

	async execute(dto: CancelSlotDto): Promise<void> {
		const existingSlot = await this._slotRepository.findById(dto.slotId);
		// check if the slot exists
		if (!existingSlot)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);
		// check if the slot belongs to the mentor
		if (existingSlot.mentorId !== dto.mentorId)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);

		// Check if slot is actually cancelled
		if (existingSlot.status !== SlotStatus.CANCELLED) {
			throw new AppError("Slot is not cancelled", HttpStatus.BAD_REQUEST);
		}

		await this._slotRepository.update(existingSlot.id, {
			status: SlotStatus.OPEN,
			cancelledAt: undefined,
			cancelledBy: undefined,
		});
	}
}
