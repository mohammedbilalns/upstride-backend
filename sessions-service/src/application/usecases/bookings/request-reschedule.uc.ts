import { RequestRescheduleDto } from "../../dtos/booking.dto";
import { Booking } from "../../../domain/entities/booking.entity";
import { IRequestRescheduleUC } from "../../../domain/useCases/bookings/request-reschedule.usecase.interface";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { AppError } from "../../errors/app-error";
import { HttpStatus } from "../../../common/enums";
import { SlotStatus } from "../../../domain/entities/slot.entity";

export class RequestRescheduleUC implements IRequestRescheduleUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(dto: RequestRescheduleDto): Promise<Booking> {
		const booking = await this._bookingRepository.findById(dto.bookingId);
		if (!booking) throw new AppError("Booking not found", HttpStatus.NOT_FOUND);

		if (booking.userId !== dto.userId)
			throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

		// Validate requested Slot
		const slot = await this._slotRepository.findById(dto.requestedSlotId);
		if (!slot) throw new AppError("Slot not found", HttpStatus.NOT_FOUND);

		if (slot.status !== SlotStatus.OPEN || !slot.isActive) {
			throw new AppError(
				"Selected slot is not available",
				HttpStatus.BAD_REQUEST,
			);
		}

		// Update Booking with request
		const updated = await this._bookingRepository.updateRescheduleStatus(
			dto.bookingId,
			"PENDING",
			{
				requestedSlotId: dto.requestedSlotId,
				reason: dto.reason,
				isStudentRequest: dto.isStudentRequest,
				createdAt: new Date(),
			},
		);

		if (!updated)
			throw new AppError(
				"Failed to update booking",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);

		return updated;
	}
}
