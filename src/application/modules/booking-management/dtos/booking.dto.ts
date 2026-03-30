import type { BookingFilter } from "../../../../domain/repositories/booking.repository.interface";

// ──────────────────────────────────────────────
// Get Available Slots
// ──────────────────────────────────────────────
export interface GetAvailableSlotsInput {
	mentorId: string;
	requesterUserId: string;
	/** YYYY-MM-DD (UTC) */
	date: Date;
}

export interface SlotDto {
	startTime: string; // HH:MM (UTC)
	endTime: string; // HH:MM (UTC)
}

export interface GetAvailableSlotsResponse {
	slots: SlotDto[];
}

// ──────────────────────────────────────────────
// Create Booking
// ──────────────────────────────────────────────
export interface CreateBookingInput {
	menteeId: string;
	mentorId: string;
	startTime: string;
	endTime: string;
	notes?: string;
}

export interface CreateBookingResponse {
	bookingId: string;
}

// ──────────────────────────────────────────────
// Cancel Booking
// ──────────────────────────────────────────────
export interface CancelBookingInput {
	userId: string;
	bookingId: string;
	reason?: string;
}

export interface CancelBookingResponse {
	bookingId: string;
	status: "CANCELLED_BY_MENTEE" | "CANCELLED_BY_MENTOR";
}

// ──────────────────────────────────────────────
// Get Bookings (paginated)
// ──────────────────────────────────────────────
export interface GetBookingsInput {
	userId: string;
	filter?: BookingFilter;
	page?: number;
	limit?: number;
}

export interface BookingDto {
	id: string;
	mentorId: string;
	menteeId: string;
	startTime: string;
	endTime: string;
	startDate: string;
	status: string;
	meetingLink: string;
	notes: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetBookingsResponse {
	items: BookingDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
