import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { ICreateCustomSlotUC } from "../../../domain/useCases/slots/create-custom-slot.uc.interface";
import { CreateCustomSlotDto } from "../../dtos/slot.dto";
import { AppError } from "../../errors/app-error";
import { SlotStatus } from "../../../domain/entities/slot.entity";

export class CreateCustomSlotUC implements ICreateCustomSlotUC {
	constructor(private _slotRepository: ISlotRepository) {}

	async execute(slotDetails: CreateCustomSlotDto): Promise<void> {
		// check if there is already a slot overlapping the duration
		const overlappingSlot = await this._slotRepository.findOverlappingSlots(
			slotDetails.mentorId,
			slotDetails.startAt,
			slotDetails.endAt,
		);
		if (overlappingSlot)
			throw new AppError(
				ErrorMessage.SLOT_DURATION_OVERLAP,
				HttpStatus.BAD_REQUEST,
			);

		await this._slotRepository.create({
			mentorId: slotDetails.mentorId,
			startAt: slotDetails.startAt,
			endAt: slotDetails.endAt,
			price: slotDetails.price,
			generatedFrom: "custom",
			status: SlotStatus.OPEN,
		});
	}
}
