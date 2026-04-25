import type {
	BookingStatus,
	PaymentStatus,
	PaymentType,
} from "../../../../domain/entities/booking.entity";
import type { BookingFilter } from "../../../../domain/repositories/booking.repository.interface";
import type { ReviewDto } from "../../review/dtos/review.dto";

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
	startTime: string; // ISO string (UTC)
	endTime: string; // ISO string (UTC)
	durationMinutes: number;
	price: number;
	status: "AVAILABLE" | "BOOKED" | "BOOKED_PENDING";
	bookingId?: string;
	bookingPaymentStatus?: PaymentStatus;
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
// Repay Booking (Stripe)
// ──────────────────────────────────────────────
export interface RepayBookingInput {
	userId: string;
	bookingId: string;
}

export interface RepayBookingResponse {
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
	refund?: RefundInfo;
}

export interface RefundInfo {
	amount: number;
	percentage: number;
	currency: "COINS";
	reason: string;
}

export interface RefundSessionAmountInput {
	bookingId: string;
	userId: string;
	startTime: string;
	paymentType: PaymentType;
	paymentStatus: PaymentStatus;
	totalAmount: number;
	cancelledBy: "user" | "mentor";
}

export interface RefundSessionAmountResponse {
	refund: RefundInfo;
}

// ──────────────────────────────────────────────
// Get Booking Details
// ──────────────────────────────────────────────
export interface GetBookingDetailsInput {
	userId: string;
	bookingId: string;
}

export interface GetBookingDetailsResponse {
	booking: BookingDto;
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
	mentorUserId: string | null;
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
	menteeName: string | null;
	mentorName: string | null;
	review: ReviewDto | null;
	settledAt: string | null;
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
