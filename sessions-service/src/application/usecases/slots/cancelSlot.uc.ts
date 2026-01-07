import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { CancelledBy, SlotStatus } from "../../../domain/entities/slot.entity";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { ICancleSlotUC } from "../../../domain/useCases/slots/cancelSlot.uc.interface";
import { CancelSlotDto } from "../../dtos/slot.dto";
import { AppError } from "../../errors/AppError";

export class CancelSlotUC implements ICancleSlotUC {
	constructor(private _slotRepository: ISlotRepository) {}

	async execute(dto: CancelSlotDto): Promise<void> {
		const existingSlot = await this._slotRepository.findById(dto.slotId);
		// check if the slot exists
		if (!existingSlot)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);
		// check if the slot belongs to the mentor
		if (existingSlot.mentorId !== dto.mentorId)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);

		await this._slotRepository.update(existingSlot.id, {
			status: SlotStatus.CANCELLED,
			cancelledAt: new Date(),
			cancelledBy: CancelledBy.MENTOR,
		});
	}
}
