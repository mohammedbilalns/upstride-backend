export enum SlotStatus {
	OPEN = "OPEN",
	FULL = "FULL",
	CANCELLED = "CANCELLED",
	STARTED = "STARTED",
	COMPLETED = "COMPLETED",
}
export enum CancelledBy {
	MENTOR = "Mentor",
	PARTICIPANT = "Participant",
}

export interface Slot {
	id: string;
	mentorId: string;
	description?: string;
	startAt: Date;
	endAt: Date;
	generatedFrom: string;
	status: SlotStatus;
	price: number;
	participantId: string;
	cancelledAt: Date;
	cancelledBy: CancelledBy;
	cancelReason: string;
	isActive: boolean;
	createdAt: Date;
}
