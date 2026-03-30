import { inject, injectable } from "inversify";
import type { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository.interface";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { AvailabilitySlotUtil } from "../../availability-management/utils/availability-slot.util";
import type {
	GetAvailableSlotsInput,
	GetAvailableSlotsResponse,
} from "../dtos/booking.dto";
import { InvalidDateError } from "../errors/booking.errors";
import type { IGetAvailableSlotsUseCase } from "./get-available-slots.usecase.interface";

@injectable()
export class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase {
	constructor(
		@inject(TYPES.Repositories.AvailabilityRepository)
		private readonly _availabilityRepository: IAvailabilityRepository,
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
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

		const allSlots: { startTime: string; endTime: string }[] = [];

		for (const availability of availabilities) {
			const slots = AvailabilitySlotUtil.computeSlotsForDate(
				availability,
				targetDate,
				mappedBookings,
			);
			allSlots.push(...slots);
		}

		const uniqueSlotsMap = new Map<
			string,
			{ startTime: string; endTime: string }
		>();
		for (const slot of allSlots) {
			uniqueSlotsMap.set(`${slot.startTime}-${slot.endTime}`, slot);
		}

		const uniqueSlots = Array.from(uniqueSlotsMap.values());
		uniqueSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

		return { slots: uniqueSlots };
	}
}
