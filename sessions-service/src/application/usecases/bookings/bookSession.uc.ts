import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IBookSessionUC } from "../../../domain/useCases/bookings/bookSession.uc.interface";
import { bookSessionDto } from "../../dtos/booking.dto";
import { AppError } from "../../errors/AppError";

export class BookSessionUc implements IBookSessionUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(dto: bookSessionDto): Promise<void> {
		const slot = await this._slotRepository.findById(dto.slotId);
		if (!slot)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);
		if (slot.status !== SlotStatus.OPEN) {
			throw new AppError(
				ErrorMessage.SLOT_IS_ALREADY_TAKEN,
				HttpStatus.BAD_REQUEST,
			);
		}

		await Promise.all([
			this._slotRepository.update(dto.slotId, {
				status: SlotStatus.FULL,
				participantId: dto.userId,
			}),
			// TODO : payment verification and then save the doc
			this._bookingRepository.create({}),
		]);
	}
}
