import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { BookingStatus } from "../../../domain/entities/booking.entity";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IBookSessionUC } from "../../../domain/useCases/bookings/book-session.uc.interface";
import { BookSessionDto } from "../../dtos/booking.dto";
import { AppError } from "../../errors/app-error";

export class BookSessionUc implements IBookSessionUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(
		dto: BookSessionDto,
	): Promise<{ bookingId: string; paymentId: string }> {
		const slot = await this._slotRepository.findById(dto.slotId);
		if (!slot)
			throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.BAD_REQUEST);

		if (slot.status !== SlotStatus.OPEN) {
			throw new AppError(
				ErrorMessage.SLOT_IS_ALREADY_TAKEN,
				HttpStatus.BAD_REQUEST,
			);
		}

		//  Reserve Slot
		await this._slotRepository.update(dto.slotId, {
			status: SlotStatus.RESERVED,
			participantId: dto.userId,
		});

		//  Create Pending Booking
		const booking = await this._bookingRepository.create({
			slotId: dto.slotId,
			userId: dto.userId,
			status: BookingStatus.PENDING,
			paymentId: "PENDING",
		});

		return {
			bookingId: booking.id,
			paymentId: booking.id,
		};
	}
}
