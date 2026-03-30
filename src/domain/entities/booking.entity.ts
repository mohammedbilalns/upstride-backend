import { isValidTimeRange } from "../../shared/utilities/time.util";
import { EntityValidationError } from "../errors";

export const BookingStatus = [
	"CANCELLED_BY_MENTEE",
	"CANCELLED_BY_MENTOR",
	"CONFIRMED",
	"PENDING",
	"COMPLETED",
] as const;
export type BookingStatus = (typeof BookingStatus)[number];

type CreateBookingData = {
	mentorId: string;
	menteeId: string;
	startTime: string;
	endTime: string;
	meetingLink: string;
	notes?: string;
};
export class Booking {
	constructor(
		public readonly id: string,
		public readonly mentorId: string,
		public readonly menteeId: string,
		public readonly startTime: string,
		public readonly endTime: string,
		public readonly status: BookingStatus,
		public readonly meetingLink: string,
		public readonly notes: string | null,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}

	static create(data: CreateBookingData) {
		if (data.mentorId === data.menteeId) {
			throw new EntityValidationError(
				"Booking",
				"Mentor and Mentee cannot be the same",
			);
		}

		if (!isValidTimeRange(data.startTime, data.endTime)) {
			throw new EntityValidationError("Booking", "Invalid time range");
		}

		return {
			mentorId: data.mentorId,
			menteeId: data.menteeId,
			startTime: data.startTime,
			endTime: data.endTime,
			meetingLink: data.meetingLink,
			notes: data.notes,
		};
	}

	/**
	 * Asserts that the booker is not booking their own session slot.
	 */
	static assertCanBook(bookerUserId: string, mentorUserId: string): void {
		if (bookerUserId === mentorUserId) {
			throw new EntityValidationError(
				"Booking",
				"You cannot book your own session.",
			);
		}
	}

	/**
	 * Asserts that the booking is in a state that allows cancellation.
	 */
	static assertCancellable(status: BookingStatus): void {
		if (status !== "PENDING" && status !== "CONFIRMED") {
			throw new EntityValidationError(
				"Booking",
				"Only pending or confirmed bookings can be cancelled.",
			);
		}
	}

	/**
	 * Asserts that the booking can still be rescheduled given a minimum
	 */
	assertReschedulable(windowHours: number): void {
		const windowMs = windowHours * 60 * 60 * 1000;
		if (new Date(this.startTime).getTime() - Date.now() < windowMs) {
			throw new EntityValidationError(
				"Booking",
				`Cannot reschedule within ${windowHours} hours of the session start.`,
			);
		}
	}
}
