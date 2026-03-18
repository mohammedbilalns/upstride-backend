import type { SessionBookingFilter } from "../../../domain/repositories/session-booking.repository.interface";

export interface GetBookingsInput {
	userId: string;
	filter: SessionBookingFilter;
	page: number;
	limit: number;
}

export interface BookingListItemDto {
	id: string;
	userId: string;
	mentorId: string;
	slotId: string;
	startTime: Date;
	endTime: Date;
	price: number;
	status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
	createdAt: Date;
	updatedAt: Date;
}

export interface GetBookingsResponse {
	items: BookingListItemDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
