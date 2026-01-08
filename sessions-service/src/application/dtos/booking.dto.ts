export interface BookSessionDto {
	userId: string;
	slotId: string;
}

export interface CancelBookingDto {
	userId: string;
	bookingId: string;
}

export interface GetBookingsDto {
	userId: string;
	role: "mentor" | "mentee";
	mentorId?: string;
}

export interface RequestRescheduleDto {
	bookingId: string;
	requestedSlotId: string;
	reason?: string;
	isStudentRequest: boolean;
	userId: string;
}

export interface HandleRescheduleDto {
	bookingId: string;
	action: "APPROVED" | "REJECTED";
	mentorId: string;
}
