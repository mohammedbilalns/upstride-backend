import { EntityValidationError } from "../errors";

export type SessionSlotStatus = "available" | "booked" | "blocked";

export class SessionSlot {
	constructor(
		public readonly id: string,
		public readonly mentorId: string,
		public readonly startTime: Date,
		public readonly endTime: Date,
		public readonly durationMinutes: number,
		public readonly price: number,
		public readonly currency: "coins",
		public readonly status: SessionSlotStatus,
		public readonly bookingId: string | null,
		public readonly createdFromRuleId: string | null,
	) {
		if (endTime <= startTime) {
			throw new EntityValidationError(
				"SessionSlot",
				"End time must be after start time.",
			);
		}
		if (durationMinutes <= 0) {
			throw new EntityValidationError(
				"SessionSlot",
				"Duration must be positive.",
			);
		}
		if (price < 0) {
			throw new EntityValidationError(
				"SessionSlot",
				"Price must be non-negative.",
			);
		}
		if (currency !== "coins") {
			throw new EntityValidationError("SessionSlot", "Currency must be coins.");
		}
	}
}
