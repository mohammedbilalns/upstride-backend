import { EntityValidationError } from "../errors";
import type { UserRole } from "./user.entity";

export const CallSessionParticipantStatus = [
	"CONNECTED",
	"DISCONNECTED",
] as const;
export type CallSessionParticipantStatus =
	(typeof CallSessionParticipantStatus)[number];

export const CallSessionStatus = [
	"WAITING",
	"CONNECTED",
	"DISCONNECTED",
] as const;
export type CallSessionStatus = (typeof CallSessionStatus)[number];

interface CallSessionParticipant {
	userId: string;
	role: UserRole;
	status: CallSessionParticipantStatus;
}

interface CreateCallSessionData {
	bookingId: string;
	participants: Omit<CallSessionParticipant, "status">[];
}

export class CallSession {
	constructor(
		public readonly id: string,
		public readonly bookingId: string,
		public readonly participants: CallSessionParticipant[],
		public readonly status: CallSessionStatus,
		public readonly startedAt: Date,
		public readonly endedAt: Date | null,
	) {}

	static create(data: CreateCallSessionData) {
		if (data.participants.length < 2 || data.participants.length > 2) {
			throw new EntityValidationError(
				"CallSession",
				"Invalid number of participants",
			);
		}

		return {
			bookingId: data.bookingId,
			participants: data.participants,
			status: "WAITING",
		};
	}
}
