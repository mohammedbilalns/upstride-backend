import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";

/**
 * Checks if a user has any conflicting bookings (either as a mentor or a mentee)
 * that overlap with the specified time range.
 *
 * @returns true if a conflict exists, false otherwise.
 */
export const checkBookingConflict = async (
	userId: string,
	startTime: Date,
	endTime: Date,
	bookingRepository: IBookingRepository,
	mentorRepository: IMentorProfileReadRepository,
	excludeBookingId?: string,
): Promise<boolean> => {
	const mentorProfile = await mentorRepository.findProfileByUserId(userId);
	const mentorId = mentorProfile ? mentorProfile.id : null;

	const conflicts = await bookingRepository.findOverlappingForUser(
		userId,
		mentorId,
		startTime,
		endTime,
	);

	const blockingConflict = conflicts.find(
		(booking) =>
			booking.id !== excludeBookingId &&
			(booking.paymentStatus === "COMPLETED" ||
				booking.menteeId === userId ||
				(mentorId && booking.mentorId === mentorId)),
	);

	return !!blockingConflict;
};
