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
	//capacity: Number;
	status: SlotStatus;
	price: Number;
	participantId: string;
	//metadata: {};
	cancelledAt: Date;
	cancelledBy: string;
	cancelReason: string;
	createdAt: Date;
}
