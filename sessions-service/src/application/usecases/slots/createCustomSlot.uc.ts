import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { ICreateCustomSlotUC } from "../../../domain/useCases/slots/createCustomSlot.uc.interface";
import { CreateCustomSlotDto } from "../../dtos/slot.dto";
import { AppError } from "../../errors/AppError";

export class CreateCustomSlot implements ICreateCustomSlotUC {
	constructor(private _slotRepository: ISlotRepository) {}

	async execute(dto: CreateCustomSlotDto): Promise<void> {
		// check if there is already a slot overlapping the duration
		const overlappingSlot = await this._slotRepository.findOverlappingSlots(
			dto.mentorId,
			dto.startAt,
			dto.endAt,
		);
		if (overlappingSlot)
			throw new AppError(
				ErrorMessage.SLOT_DURATION_OVERLAP,
				HttpStatus.BAD_REQUEST,
			);

		await this._slotRepository.create({
			mentorId: dto.mentorId,
			startAt: dto.startAt,
			endAt: dto.endAt,
		});
		//TODO: what about the price in this case ?
	}
}
