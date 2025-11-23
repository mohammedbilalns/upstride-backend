enum SlotStatus {
	PENDING = "PENDING",
	CONFIRMED = "CONFIRMED",
	CANCELLED = "CANCELLED",
	REFUNDED = "REFUNDED",
}
export interface Booking {
	id: string;
	slotId: string;
	userId: string;
	status: SlotStatus;
	paymentId: string;
	createdAt: Date;
}
