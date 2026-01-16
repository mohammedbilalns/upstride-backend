import { IConfirmSessionUC } from "../../../domain/useCases/bookings/confirm-session.uc.interface";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { BookingStatus } from "../../../domain/entities/booking.entity";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import logger from "../../../common/utils/logger";
import { AppError } from "../../errors/app-error";
import { ErrorMessage, HttpStatus } from "../../../common/enums";

export class ConfirmSessionUC implements IConfirmSessionUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
	) { }

	/**
	 * Confirms a session after successful payment.
	 * 1. Updates booking status to CONFIRMED.
	 * 2. Updates slot status to FULL.
	 */
	async execute(bookingId: string, paymentId: string): Promise<void> {
		//  Find the booking by bookingId
		const booking = await this._bookingRepository.findById(bookingId);

		if (!booking) {
			throw new AppError(ErrorMessage.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		if (booking.status === BookingStatus.CONFIRMED) {
			logger.info(`Booking ${booking.id} already confirmed`);
			return;
		}

		//  Update Booking Status and PaymentID
		await this._bookingRepository.update(booking.id, {
			status: BookingStatus.CONFIRMED,
			paymentId: paymentId,
		});

		logger.info(`Booking retrieved for confirmation: ${JSON.stringify(booking)}`);
		logger.info(`Slot ID type: ${typeof booking.slotId}, value: ${booking.slotId}`);

		if (typeof booking.slotId !== 'string') {
			logger.warn(`WARNING: booking.slotId is NOT a string! It is: ${typeof booking.slotId}`);
		}

		//  Update Slot Status
		await this._slotRepository.update(booking.slotId, {
			status: SlotStatus.FULL,
		});

		logger.info(
			`Session verified and confirmed: ${booking.id} with payment: ${paymentId}`,
		);
	}
}
