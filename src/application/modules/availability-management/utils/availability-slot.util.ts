import type { Availability } from "../../../../domain/entities/availability.entity";
import { toMinutes } from "../../../../shared/utilities/time.util";

interface Slot {
	startTime: string;
	endTime: string;
}

export class AvailabilitySlotUtil {
	/**
	 * Computes the available time slots for a specific date, given the mentor's existing bookings.
	 * Returns slots in HH:MM format in UTC.
	 */
	static computeSlotsForDate(
		availability: Availability,
		date: Date, // UTC Date representing the day
		existingBookings: { startTime: string; endTime: string }[],
	): { startTime: string; endTime: string }[] {
		if (!availability.status) return [];
		const slots: Slot[] = [];
		const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
		const now = Date.now();

		const toStr = (mins: number) => {
			const h = Math.floor(mins / 60)
				.toString()
				.padStart(2, "0");
			const m = (mins % 60).toString().padStart(2, "0");
			return `${h}:${m}`;
		};

		let currentMin = toMinutes(availability.startTime);
		const endMin = toMinutes(availability.endTime);

		while (currentMin + availability.slotDuration <= endMin) {
			const slotStartMin = currentMin;
			const slotEndMin = currentMin + availability.slotDuration;

			const slotStartStr = toStr(slotStartMin);
			const slotEndStr = toStr(slotEndMin);

			// Compute exact ISO datetimes for overlap check
			const slotStartIso = `${dateStr}T${slotStartStr}:00.000Z`;
			const slotEndIso = `${dateStr}T${slotEndStr}:00.000Z`;
			const slotStartMs = Date.parse(slotStartIso);

			// Skip past slots (only relevant for today's date)
			if (!Number.isNaN(slotStartMs) && slotStartMs <= now) {
				currentMin += availability.slotDuration + availability.bufferTime;
				continue;
			}

			// Check break overlaps
			const overlapsBreak = availability.breakTimes.some((b) => {
				const bStart = toMinutes(b.startTime);
				const bEnd = toMinutes(b.endTime);
				return slotStartMin < bEnd && slotEndMin > bStart;
			});

			// Check existing bookings overlaps
			const overlapsBooking = existingBookings.some((b) => {
				return slotStartIso < b.endTime && slotEndIso > b.startTime;
			});

			if (!overlapsBreak && !overlapsBooking) {
				slots.push({
					startTime: slotStartStr,
					endTime: slotEndStr,
				});
			}

			// Step forward
			currentMin += availability.slotDuration + availability.bufferTime;
		}

		return slots;
	}
}
