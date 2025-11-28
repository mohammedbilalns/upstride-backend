export enum BookingStatus {
	PENDING = "PENDING",
	CONFIRMED = "CONFIRMED",
	CANCELLED = "CANCELLED",
	REFUNDED = "REFUNDED",
}
export interface Booking {
	id: string;
	slotId: string;
	userId: string;
	status: BookingStatus;
	paymentId: string;
	createdAt: Date;
}
