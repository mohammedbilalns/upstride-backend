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
}
