import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { BookingStatus } from "../../../domain/entities/booking.entity";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { ICancelBookingUC } from "../../../domain/useCases/bookings/cancelBooking.uc.interface";
import { cancelBookingDto } from "../../dtos/booking.dto";
import { AppError } from "../../errors/AppError";

export class CancelBookingUC implements ICancelBookingUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(dto: cancelBookingDto): Promise<void> {
		const booking = await this._bookingRepository.findById(dto.bookingId);
		if (!booking)
			throw new AppError(
				ErrorMessage.BOOKING_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);
		if (booking.userId !== dto.userId)
			throw new AppError(
				ErrorMessage.FORBIDDEN_RESOURCE,
				HttpStatus.BAD_REQUEST,
			);

		await Promise.all([
			this._bookingRepository.update(dto.bookingId, {
				status: BookingStatus.CANCELLED,
			}),
			this._slotRepository.update(booking.slotId, { status: SlotStatus.OPEN }),
		]);
	}
}
