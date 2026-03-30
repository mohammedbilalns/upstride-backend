import type { Availability } from "../../../../domain/entities/availability.entity";

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
		const slots: { startTime: string; endTime: string }[] = [];
		const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD

		const toMins = (time: string) => {
			const [h, m] = time.split(":").map(Number);
			return h * 60 + m;
		};

		const toStr = (mins: number) => {
			const h = Math.floor(mins / 60)
				.toString()
				.padStart(2, "0");
			const m = (mins % 60).toString().padStart(2, "0");
			return `${h}:${m}`;
		};

		let currentMin = toMins(availability.startTime);
		const endMin = toMins(availability.endTime);

		while (currentMin + availability.slotDuration <= endMin) {
			const slotStartMin = currentMin;
			const slotEndMin = currentMin + availability.slotDuration;

			const slotStartStr = toStr(slotStartMin);
			const slotEndStr = toStr(slotEndMin);

			// Compute exact ISO datetimes for overlap check
			const slotStartIso = `${dateStr}T${slotStartStr}:00.000Z`;
			const slotEndIso = `${dateStr}T${slotEndStr}:00.000Z`;

			// Check break overlaps
			const overlapsBreak = availability.breakTimes.some((b) => {
				const bStart = toMins(b.startTime);
				const bEnd = toMins(b.endTime);
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
