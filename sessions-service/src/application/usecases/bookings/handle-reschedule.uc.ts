import { HandleRescheduleDto } from "../../dtos/booking.dto";
import { Booking } from "../../../domain/entities/booking.entity";
import { IHandleRescheduleUC } from "../../../domain/useCases/bookings/handle-reschedule.usecase.interface";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { AppError } from "../../errors/app-error";
import { HttpStatus } from "../../../common/enums";
import { SlotStatus } from "../../../domain/entities/slot.entity";

export class HandleRescheduleUC implements IHandleRescheduleUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
	) { }

	/**
	 * Handles a reschedule request (Approve/Reject).
	 * If Approved:
	 *  - Frees old slot.
	 *  - Books new slot.
	 *  - Updates booking with new slotId.
	 */
	async execute(dto: HandleRescheduleDto): Promise<Booking> {
		const booking = await this._bookingRepository.findById(dto.bookingId);
		if (!booking) throw new AppError("Booking not found", HttpStatus.NOT_FOUND);

		const currentSlot = await this._slotRepository.findById(booking.slotId);
		if (!currentSlot)
			throw new AppError(
				"Current slot info missing",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);

		if (currentSlot.mentorId !== dto.mentorId) {
			throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
		}

		if (
			!booking.rescheduleRequest ||
			booking.rescheduleRequest.status !== "PENDING"
		) {
			throw new AppError(
				"No pending reschedule request",
				HttpStatus.BAD_REQUEST,
			);
		}

		if (dto.action === "REJECTED") {
			const updated = await this._bookingRepository.updateRescheduleStatus(
				dto.bookingId,
				"REJECTED",
			);
			if (!updated)
				throw new AppError(
					"Failed to update booking",
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			return updated;
		}

		// APPROVED
		const newSlotId = booking.rescheduleRequest.requestedSlotId;
		const newSlot = await this._slotRepository.findById(newSlotId);
		if (!newSlot || newSlot.status !== SlotStatus.OPEN) {
			throw new AppError(
				"New slot is no longer available",
				HttpStatus.CONFLICT,
			);
		}

		// 1. Free old slot
		await this._slotRepository.update(currentSlot.id, {
			status: SlotStatus.OPEN,
		});

		// 2. Book new slot
		await this._slotRepository.update(newSlot.id, {
			status: SlotStatus.FULL,
		});

		await this._bookingRepository.update(booking.id, { slotId: newSlotId });

		const updated = await this._bookingRepository.updateRescheduleStatus(
			booking.id,
			"APPROVED",
		);

		if (!updated)
			throw new AppError(
				"Failed to update booking",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		return updated;
	}
}
