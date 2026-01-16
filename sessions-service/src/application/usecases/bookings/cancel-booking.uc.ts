import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { BookingStatus } from "../../../domain/entities/booking.entity";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { ICancelBookingUC } from "../../../domain/useCases/bookings/cancel-booking.uc.interface";
import { CancelBookingDto } from "../../dtos/booking.dto";
import { AppError } from "../../errors/app-error";
import { IEventBus } from "../../../domain/events/event-bus.interface";
import { QueueEvents } from "../../../common/enums/queue-events";

interface RefundBreakdown {
	userAmount: number;
	mentorAmount: number;
	platformAmount: number;
	userPercentage: number;
	mentorPercentage: number;
	platformPercentage: number;
}

export class CancelBookingUC implements ICancelBookingUC {
	constructor(
		private _bookingRepository: IBookingRepository,
		private _slotRepository: ISlotRepository,
		private _eventBus: IEventBus,
	) { }

	/**
	 * Executes the cancel booking logic.
	 * 1. Validates the booking.
	 * 2. Calculates refund breakdown based on time until session.
	 * 3. Updates booking status to CANCELLED and slot to OPEN.
	 * 4. Emits BOOKING_CANCELLED event.
	 */
	async execute(dto: CancelBookingDto): Promise<void> {
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

		// Fetch slot to get price and start time
		const slot = await this._slotRepository.findById(booking.slotId);
		if (!slot) {
			throw new AppError(
				ErrorMessage.SLOT_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);
		}

		// Calculate refund based on time until session
		const now = new Date();
		const sessionStart = slot.startAt;
		const hoursUntilSession =
			(sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);

		const refundBreakdown = this.calculateRefundBreakdown(
			slot.price,
			hoursUntilSession,
		);

		// Update booking status to CANCELLED
		await Promise.all([
			this._bookingRepository.update(dto.bookingId, {
				status: BookingStatus.CANCELLED,
			}),
			this._slotRepository.update(booking.slotId, { status: SlotStatus.OPEN }),
		]);

		// Emit BOOKING_CANCELLED event for payment service to process refund
		await this._eventBus.publish(QueueEvents.BOOKING_CANCELLED, {
			bookingId: booking.id,
			userId: booking.userId,
			mentorId: slot.mentorId,
			totalAmount: slot.price,
			refundBreakdown,
			hoursUntilSession,
		});
	}

	private calculateRefundBreakdown(
		totalAmount: number,
		hoursUntilSession: number,
	): RefundBreakdown {
		let userPercentage: number;
		let mentorPercentage: number;
		let platformPercentage: number;

		if (hoursUntilSession < 24) {
			// Less than 24 hours before session
			userPercentage = 0.5; // 50%
			mentorPercentage = 0.4; // 40%
			platformPercentage = 0.1; // 10%
		} else if (hoursUntilSession < 72) {
			// 24-72 hours before session
			userPercentage = 0.7; // 70%
			mentorPercentage = 0.2; // 20%
			platformPercentage = 0.1; // 10%
		} else {
			// More than 72 hours before session
			userPercentage = 0.8; // 80%
			mentorPercentage = 0.1; // 10%
			platformPercentage = 0.1; // 10%
		}

		return {
			userAmount: totalAmount * userPercentage,
			mentorAmount: totalAmount * mentorPercentage,
			platformAmount: totalAmount * platformPercentage,
			userPercentage,
			mentorPercentage,
			platformPercentage,
		};
	}
}
