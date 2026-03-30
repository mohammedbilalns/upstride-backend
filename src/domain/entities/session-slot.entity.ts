import { EntityValidationError } from "../errors";

export type SessionSlotStatus = "available" | "booked" | "blocked";

/** Allowed session durations in minutes. */
export const ALLOWED_DURATIONS: ReadonlySet<number> = new Set([30, 60]);

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
		if (!ALLOWED_DURATIONS.has(durationMinutes)) {
			throw new EntityValidationError(
				"SessionSlot",
				"Duration must be 30 or 60 minutes.",
			);
		}
		const diffMinutes = Math.round(
			(endTime.getTime() - startTime.getTime()) / 60000,
		);
		if (diffMinutes !== durationMinutes) {
			throw new EntityValidationError(
				"SessionSlot",
				"End time must equal start time plus duration.",
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

	/**
	 * Validates that the slot's start time has not yet passed.
	 */
	static assertFuture(startTime: Date): void {
		if (startTime.getTime() < Date.now()) {
			throw new EntityValidationError(
				"SessionSlot",
				"Cannot create a slot in the past.",
			);
		}
	}

	/**
	 * Returns a new SessionSlot with the requested status.
	 * Enforces valid transitions only:
	 */
	transitionTo(newStatus: SessionSlotStatus): SessionSlot {
		const validTransitions: Record<SessionSlotStatus, SessionSlotStatus[]> = {
			available: ["booked", "blocked"],
			booked: ["available"],
			blocked: ["available"],
		};

		if (!validTransitions[this.status].includes(newStatus)) {
			throw new EntityValidationError(
				"SessionSlot",
				`Cannot transition from '${this.status}' to '${newStatus}'.`,
			);
		}

		return new SessionSlot(
			this.id,
			this.mentorId,
			this.startTime,
			this.endTime,
			this.durationMinutes,
			this.price,
			this.currency,
			newStatus,
			newStatus === "booked" ? this.bookingId : null,
			this.createdFromRuleId,
		);
	}
}
