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

		const mappedBookings = existingBookings.map((b) => ({
			startTime: b.startTime,
			endTime: b.endTime,
		}));

		const mentor = await this._mentorProfileReadRepository.findProfileById(
			input.mentorId,
		);
		if (!mentor) {
			throw new NotFoundError("Mentor not found");
		}
		const pricePer30Min = mentor.currentPricePer30Min ?? 0;

		const allSlots: {
			startTime: string;
			endTime: string;
			durationMinutes: number;
			price: number;
		}[] = [];
		const dateStr = targetDate.toISOString().slice(0, 10);

		for (const availability of availabilities) {
			const slots = AvailabilitySlotUtil.computeSlotsForDate(
				availability,
				targetDate,
				mappedBookings,
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
				allSlots.push({
					startTime: startIso,
					endTime: endIso,
					durationMinutes,
					price,
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
			}
		>();
		for (const slot of allSlots) {
			uniqueSlotsMap.set(`${slot.startTime}-${slot.endTime}`, slot);
		}

		const uniqueSlots = Array.from(uniqueSlotsMap.values());
		uniqueSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

		return { slots: uniqueSlots };
	}
}
