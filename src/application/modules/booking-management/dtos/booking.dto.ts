import type {
	BookingStatus,
	PaymentStatus,
	PaymentType,
} from "../../../../domain/entities/booking.entity";
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
	paymentType: PaymentType;
	notes?: string;
}

export interface CreateBookingResponse {
	bookingId: string;
	paymentStatus: PaymentStatus;
	paymentUrl?: string | null;
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
	status: BookingStatus;
	paymentType: PaymentType;
	paymentStatus: PaymentStatus;
	totalAmount: number;
	currency: string;
	meetingLink: string;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface GetBookingsResponse {
	items: BookingDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
