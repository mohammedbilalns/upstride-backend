enum SlotStatus {
	OPEN = "OPEN",
	FULL = "FULL",
	CANCELLED = "CANCELLED",
	COMPLETED = "COMPLETED",
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
	cancelledBy: string;
	cancelReason: string;
	createdAt: Date;
}
