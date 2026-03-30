import { EntityValidationError } from "../errors";

export type BookingStatus =
	| "pending"
	| "confirmed"
	| "cancelled"
	| "completed"
	| "refunded";

export interface BookingPayment {
	coinsDebited: number;
	transactionId: string;
}

export interface BookingMeeting {
	roomId?: string;
	joinUrl?: string;
}

export type BookingCancellationSource = "user" | "mentor";

export class SessionBooking {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly mentorId: string,
		public readonly slotId: string,
		public readonly startTime: Date,
		public readonly endTime: Date,
		public readonly price: number,
		public readonly status: BookingStatus,
		public readonly payment: BookingPayment,
		public readonly meeting: BookingMeeting,
		public readonly cancellationReason: string | null,
		public readonly cancelledBy: BookingCancellationSource | null,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {
		if (endTime <= startTime) {
			throw new EntityValidationError(
				"SessionBooking",
				"End time must be after start time.",
			);
		}
		if (price < 0) {
			throw new EntityValidationError(
				"SessionBooking",
				"Price must be non-negative.",
			);
		}
		if (payment.coinsDebited < 0) {
			throw new EntityValidationError(
				"SessionBooking",
				"Coins debited must be non-negative.",
			);
		}
	}

	/**
	 * Asserts that the booker is not booking their own session slot.
	 */
	static assertCanBook(bookerUserId: string, mentorUserId: string): void {
		if (bookerUserId === mentorUserId) {
			throw new EntityValidationError(
				"SessionBooking",
				"You cannot book your own session.",
			);
		}
	}

	/**
	 * Asserts that the booking can still be rescheduled given the
	 */
	assertReschedulable(windowHours: number): void {
		const windowMs = windowHours * 60 * 60 * 1000;
		if (this.startTime.getTime() - Date.now() < windowMs) {
			throw new EntityValidationError(
				"SessionBooking",
				`Cannot reschedule within ${windowHours} hours of the session start.`,
			);
		}
	}
}
