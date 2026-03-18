export interface BookSessionInput {
	userId: string;
	slotId: string;
}

export interface BookSessionResponse {
	bookingId: string;
}

export interface CancelBookingInput {
	userId: string;
	bookingId: string;
	reason: string;
}

export interface CancelBookingResponse {
	bookingId: string;
	status: "cancelled";
}

export interface RequestRescheduleInput {
	userId: string;
	bookingId: string;
}

export interface RequestRescheduleResponse {
	bookingId: string;
	status: "pending";
}

export interface HandleRescheduleInput {
	userId: string;
	bookingId: string;
	newSlotId: string;
}

export interface HandleRescheduleResponse {
	bookingId: string;
	status: "confirmed";
}
