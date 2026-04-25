import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { istDateStringTimeToUtcIso } from "../../../../shared/utilities/time.util";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { AvailabilitySlotUtil } from "../../availability/utils/availability-slot.util";
import type {
	GetAvailableSlotsInput,
	GetAvailableSlotsResponse,
	SlotDto,
} from "../dtos/booking.dto";
import { InvalidDateError } from "../errors/booking.errors";
import type { IGetAvailableSlotsUseCase } from "./get-available-slots.use-case.interface";

@injectable()
export class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase {
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorProfileReadRepository: IMentorProfileReadRepository,
	) {}

	async execute(
		input: GetAvailableSlotsInput,
	): Promise<GetAvailableSlotsResponse> {
		const targetDate = input.date;
		if (Number.isNaN(targetDate.getTime())) {
			throw new InvalidDateError(
				"Invalid date format provided for date parameter.",
			);
		}

		const availabilities =
			await this._availabilityRepository.findActiveByMentorIdAndDate(
				input.mentorId,
				targetDate,
			);

		if (!availabilities || availabilities.length === 0) {
			return { slots: [] };
		}

		const existingBookings =
			await this._bookingRepository.findByMentorIdAndDate(
				input.mentorId,
				targetDate,
			);

		const mentor = await this._mentorProfileReadRepository.findProfileById(
			input.mentorId,
		);
		if (!mentor) {
			throw new NotFoundError("Mentor not found");
		}
		const pricePer30Min = mentor.currentPricePer30Min ?? 0;

		const allSlots: SlotDto[] = [];
		const dateStr = targetDate.toISOString().slice(0, 10);

		for (const availability of availabilities) {
			const slots = AvailabilitySlotUtil.computeSlotsForDate(
				availability,
				targetDate,
				[],
			);
			for (const slot of slots) {
				const startIso = istDateStringTimeToUtcIso(dateStr, slot.startTime);
				const endIso = istDateStringTimeToUtcIso(dateStr, slot.endTime);
				const start = new Date(startIso);
				const end = new Date(endIso);
				const durationMinutes = Math.round(
					(end.getTime() - start.getTime()) / (1000 * 60),
				);
				const price = (durationMinutes / 30) * pricePer30Min;

				const overlappingBooking = existingBookings.find(
					(booking) =>
						start.getTime() < new Date(booking.endTime).getTime() &&
						end.getTime() > new Date(booking.startTime).getTime(),
				);

				const ownsPendingBooking =
					overlappingBooking?.paymentStatus === "PENDING" &&
					overlappingBooking.menteeId === input.requesterUserId;
				const isConfirmedBooking =
					overlappingBooking?.paymentStatus === "COMPLETED" ||
					overlappingBooking?.status === "STARTED" ||
					overlappingBooking?.status === "CONFIRMED";

				if (isConfirmedBooking) {
					continue;
				}

				allSlots.push({
					startTime: startIso,
					endTime: endIso,
					durationMinutes,
					price,
					status: ownsPendingBooking ? "BOOKED_PENDING" : "AVAILABLE",
					bookingId: ownsPendingBooking ? overlappingBooking?.id : undefined,
					bookingPaymentStatus: ownsPendingBooking
						? overlappingBooking?.paymentStatus
						: undefined,
				});
			}
		}

		const uniqueSlotsMap = new Map<
			string,
			{
				startTime: string;
				endTime: string;
				durationMinutes: number;
				price: number;
				status: "AVAILABLE" | "BOOKED" | "BOOKED_PENDING";
				bookingId?: string;
				bookingPaymentStatus?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
			}
		>();
		for (const slot of allSlots) {
			const key = `${slot.startTime}-${slot.endTime}`;
			const existing = uniqueSlotsMap.get(key);
			if (!existing) {
				uniqueSlotsMap.set(key, slot);
				continue;
			}

			uniqueSlotsMap.set(key, {
				...existing,
				...slot,
				status:
					existing.status === "BOOKED_PENDING" ||
					slot.status === "BOOKED_PENDING"
						? "BOOKED_PENDING"
						: "AVAILABLE",
				bookingId: existing.bookingId ?? slot.bookingId,
				bookingPaymentStatus:
					existing.bookingPaymentStatus ?? slot.bookingPaymentStatus,
			});
		}

		const uniqueSlots = Array.from(uniqueSlotsMap.values());
		uniqueSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

		return { slots: uniqueSlots };
	}
}
