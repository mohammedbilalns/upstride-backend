import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { SlotNotFoundError } from "../../session-slot-management/errors";
import { BookingNotFoundError, RescheduleWindowPassedError } from "../errors";

export async function getBookingForUserOrThrow(
	repository: ISessionBookingRepository,
	bookingId: string,
	userId: string,
) {
	const booking = await repository.findById(bookingId);
	if (!booking || booking.userId !== userId) {
		throw new BookingNotFoundError();
	}
	return booking;
}

export async function getBookingForMentorOrThrow(
	repository: ISessionBookingRepository,
	bookingId: string,
	mentorId: string,
) {
	const booking = await repository.findById(bookingId);
	if (!booking || booking.mentorId !== mentorId) {
		throw new BookingNotFoundError();
	}
	return booking;
}

export function assertRescheduleWindow(
	startTime: Date,
	rescheduleWindowHours: number,
) {
	const latest = new Date(startTime);
	latest.setHours(latest.getHours() - rescheduleWindowHours);
	if (new Date() > latest) {
		throw new RescheduleWindowPassedError();
	}
}

export async function updateSlotStatus(
	repository: ISessionSlotRepository,
	slotId: string,
	status: "available" | "booked" | "blocked",
	bookingId: string | null,
) {
	return repository.updateById(slotId, {
		status,
		bookingId,
	});
}

export async function releaseSlotOrThrow(
	repository: ISessionSlotRepository,
	slotId: string,
) {
	const updated = await updateSlotStatus(repository, slotId, "available", null);
	if (!updated) {
		throw new SlotNotFoundError();
	}
}
