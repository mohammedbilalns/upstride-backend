export enum SlotStatus {
	OPEN = "OPEN",
	FULL = "FULL",
	CANCELLED = "CANCELLED",
	COMPLETED = "COMPLETED",
}
export enum CancelledBy {
	MENTOR = "Mentor",
	PARTICIPANT = "Participant",
}

export interface Slot {
	id: string;
	mentorId: string;
	startAt: Date;
	endAt: Date;
	generatedFrom: string;
	status: SlotStatus;
	price: number;
	participantId: string;
	cancelledAt: Date;
	cancelledBy: CancelledBy;
	cancelReason: string;
	createdAt: Date;
}
