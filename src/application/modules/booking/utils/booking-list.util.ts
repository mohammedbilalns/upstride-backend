import type { Booking } from "../../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities";
import type { IReviewRepository } from "../../../../domain/repositories/review.repository.interface";
import { ReviewMapper } from "../../../../infrastructure/database/mongodb/mappers/review.mapper";
import { getClientBaseUrl } from "../../../../shared/utilities/url.util";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import type { GetBookingsResponse } from "../dtos/booking.dto";
import { BookingMapper } from "../mappers/booking.mapper";

export const buildBookingListResponse = async (
	bookingRepository: IBookingRepository,
	reviewRepository: IReviewRepository,
	result: PaginatedResult<Booking>,
): Promise<GetBookingsResponse> => {
	const clientBaseUrl = getClientBaseUrl();
	const reviews = await reviewRepository.findByBookingIds(
		result.items.map((booking) => booking.id),
	);
	const reviewByBookingId = new Map(
		reviews.map((review) => [review.bookingId, ReviewMapper.toDto(review)]),
	);
	const needsMeetingLink = result.items.filter(
		(booking) =>
			booking.paymentStatus === "COMPLETED" &&
			(!booking.meetingLink || booking.meetingLink === "Pending"),
	);

	if (needsMeetingLink.length > 0) {
		await Promise.all(
			needsMeetingLink.map((booking) =>
				bookingRepository.updateById(booking.id, {
					meetingLink: `${clientBaseUrl}/sessions/${booking.id}`,
				}),
			),
		);
	}

	return mapPaginatedResult(result, (items) =>
		items.map((booking) => {
			const dto = BookingMapper.toDto(booking);
			dto.review = reviewByBookingId.get(booking.id) ?? null;
			if (
				booking.paymentStatus === "COMPLETED" &&
				(!booking.meetingLink || booking.meetingLink === "Pending")
			) {
				dto.meetingLink = `${clientBaseUrl}/sessions/${booking.id}`;
			}
			return dto;
		}),
	);
};
