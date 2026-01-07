export interface BookSessionDto {
	userId: string;
	slotId: string;
}

export interface CancelBookingDto {
	userId: string;
	bookingId: string;
}
