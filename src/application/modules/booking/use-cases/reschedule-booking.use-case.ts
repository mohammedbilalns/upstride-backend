import { inject, injectable } from "inversify";
import { Booking } from "../../../../domain/entities/booking.entity";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IUserRepository } from "../../../../domain/repositories/user.repository.interface";
import { IST_OFFSET_MINUTES } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import { toMinutes } from "../../../../shared/utilities/time.util";
import type { JobQueuePort } from "../../../ports/job-queue.port";
import { ConflictError, NotFoundError } from "../../../shared/errors";
import type { ICreateNotificationUseCase } from "../../notification/use-cases/create-notification.use-case.interface";
import type { RescheduleBookingInput } from "../dtos/booking.dto";
import { UnauthorizedBookingActionError } from "../errors/booking.errors";
import { checkBookingConflict } from "../utils/check-booking-conflict.util";
import type { IRescheduleBookingUseCase } from "./reschedule-booking.use-case.interface";
import type { IScheduleLiveSesionReminderUseCase } from "./schedule-mentor-reminder.use-case.interface";
import type { IScheduleSessionSettlementUseCase } from "./schedule-session-settlement.use-case.interface";

@injectable()
export class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileRepository: IMentorProfileReadRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.JobQueue)
		private readonly _jobQueue: JobQueuePort,
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
		@inject(TYPES.UseCases.ScheduleLiveSesionReminder)
		private readonly _scheduleLiveSesionReminderUseCase: IScheduleLiveSesionReminderUseCase,
		@inject(TYPES.UseCases.ScheduleSessionSettlement)
		private readonly _scheduleSessionSettlementUseCase: IScheduleSessionSettlementUseCase,
	) {}

	async execute(input: RescheduleBookingInput): Promise<void> {
		const booking = await this._bookingRepository.findById(input.bookingId);
		if (!booking) {
			throw new NotFoundError("Booking not found");
		}

		if (booking.menteeId !== input.menteeId) {
			throw new UnauthorizedBookingActionError();
		}

		if (booking.status !== "CONFIRMED") {
			throw new ConflictError("Only confirmed bookings can be rescheduled");
		}

		booking.assertReschedulable(24);

		const newStart = new Date(input.newStartTime);
		const newEnd = new Date(input.newEndTime);

		if (newStart.getTime() <= Date.now() + 24 * 60 * 60 * 1000) {
			throw new ConflictError(
				"New start time must be at least 24 hours in the future",
			);
		}

		// Check mentor availability
		const availabilities =
			await this._availabilityRepository.findActiveByMentorIdAndDate(
				booking.mentorId,
				newStart,
			);

		const toIstHHMM = (date: Date) => {
			const istMs = date.getTime() + IST_OFFSET_MINUTES * 60_000;
			const istDate = new Date(istMs);
			const h = istDate.getUTCHours().toString().padStart(2, "0");
			const m = istDate.getUTCMinutes().toString().padStart(2, "0");
			return `${h}:${m}`;
		};

		const newStartIstHHMM = toIstHHMM(newStart);
		const newEndIstHHMM = toIstHHMM(newEnd);
		const newStartMins = toMinutes(newStartIstHHMM);
		const newEndMins = toMinutes(newEndIstHHMM);

		const isWithinAvailability = availabilities.some((avail) => {
			const availStartMins = toMinutes(avail.startTime);
			const availEndMins = toMinutes(avail.endTime);

			const isInsideWindow =
				newStartMins >= availStartMins && newEndMins <= availEndMins;

			if (!isInsideWindow) return false;

			const overlapsWithBreak = avail.breakTimes.some((brk) => {
				const breakStartMins = toMinutes(brk.startTime);
				const breakEndMins = toMinutes(brk.endTime);
				const overlaps =
					newStartMins < breakEndMins && newEndMins > breakStartMins;
				return overlaps;
			});

			return !overlapsWithBreak;
		});

		if (!isWithinAvailability) {
			throw new ConflictError(
				"The selected time slot is not within the mentor's availability",
			);
		}

		const overlap = await this._bookingRepository.findOverlapping(
			booking.mentorId,
			newStart,
			newEnd,
		);

		const blockingOverlap = overlap.find(
			(b) =>
				b.id !== booking.id &&
				(b.paymentStatus === "COMPLETED" || b.menteeId === booking.menteeId),
		);

		if (blockingOverlap) {
			throw new ConflictError(
				"The mentor has another session overlapping with this time",
			);
		}

		const hasMenteeConflict = await checkBookingConflict(
			booking.menteeId,
			newStart,
			newEnd,
			this._bookingRepository,
			this._mentorProfileRepository,
			booking.id,
		);

		if (hasMenteeConflict) {
			throw new ConflictError(
				"You have another session overlapping with this time",
			);
		}

		const oldStartTimeStr = new Date(booking.startTime).toLocaleString();

		// Update booking
		const updatedBooking = new Booking(
			booking.id,
			booking.mentorId,
			booking.mentorUserId,
			booking.menteeId,
			input.newStartTime,
			input.newEndTime,
			booking.status,
			booking.meetingLink,
			booking.paymentType,
			booking.paymentStatus,
			booking.totalAmount,
			booking.currency,
			booking.notes,
			booking.menteeName,
			booking.mentorName,
			booking.mentorJoinedAt,
			booking.settledAt,
			booking.feedback,
			booking.createdAt,
			new Date(),
		);

		await this._bookingRepository.updateById(booking.id, updatedBooking);

		await this._scheduleLiveSesionReminderUseCase.execute({
			start: newStart,
			bookingId: booking.id,
			mentorId: booking.mentorUserId || "",
			menteeId: booking.menteeId,
		});

		await this._scheduleSessionSettlementUseCase.execute({
			bookingId: booking.id,
			endTime: newEnd,
		});

		// Notify Mentor
		const mentorUser = await this._userRepository.findById(
			booking.mentorUserId || "",
		);
		const menteeUser = await this._userRepository.findById(booking.menteeId);

		if (mentorUser && menteeUser) {
			await this._createNotificationUseCase.execute({
				userId: mentorUser.id,
				title: "Booking Rescheduled",
				description: `${menteeUser.name} has rescheduled their session to ${newStart.toLocaleString()}.`,
				type: "SESSION",
				event: "SESSION_RESCHEDULED",
				actorId: menteeUser.id,
				relatedEntityId: booking.id,
			});

			await this._jobQueue.enqueue("send-reschedule-booking-email", {
				to: mentorUser.email,
				mentorName: mentorUser.name,
				menteeName: menteeUser.name,
				oldStartTime: oldStartTimeStr,
				newStartTime: newStart.toLocaleString(),
				newEndTime: newEnd.toLocaleString(),
			});
		}
	}
}
