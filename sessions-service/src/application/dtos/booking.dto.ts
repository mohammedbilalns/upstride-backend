export interface bookSessionDto {
	userId: string;
	slotId: string;
}

export interface cancelBookingDto {
	userId: string;
	bookingId: string;
}
