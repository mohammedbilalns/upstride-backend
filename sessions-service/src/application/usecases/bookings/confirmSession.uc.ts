import { IConfirmSessionUC } from "../../../domain/useCases/bookings/confirmSession.uc.interface";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { BookingStatus } from "../../../domain/entities/booking.entity";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import logger from "../../../common/utils/logger";

export class ConfirmSessionUC implements IConfirmSessionUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(transactionId: string): Promise<void> {
		//  Find the booking by transactionId/paymentId
		const booking =
			await this._bookingRepository.findByPaymentId(transactionId);

		if (!booking) {
			logger.warn(`Booking not found for transactionId: ${transactionId}`);
			return;
		}

		if (booking.status === BookingStatus.CONFIRMED) {
			logger.info(`Booking ${booking.id} already confirmed`);
			return;
		}

		//  Update Booking Status
		await this._bookingRepository.update(booking.id, {
			status: BookingStatus.CONFIRMED,
		});

		//  Update Slot Status
		await this._slotRepository.update(booking.slotId, {
			status: SlotStatus.FULL,
		});

		logger.info(`Session verified and confirmed: ${booking.id}`);

		// TODO: Publish SESSION.BOOKED event here for Notification Service
	}
}
