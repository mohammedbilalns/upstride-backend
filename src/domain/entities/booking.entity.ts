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
}
