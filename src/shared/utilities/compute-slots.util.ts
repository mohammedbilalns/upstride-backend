import type {
	Availability,
	BreakTime,
} from "../../domain/entities/availability.entity";
import { toMinutes } from "./time.util";

export interface SlotWindow {
	startTime: Date;
	endTime: Date;
}

/**
 * Computes all available slot windows for a given UTC date from one or more
 * Availability records, excluding windows that overlap existing bookings.
 *
 * Algorithm per Availability window:
 *  Walk from startTime to endTime in steps of slotDuration (+ bufferTime).
 *  Skip any candidate window that overlaps a breakTime.
 *  Skip any candidate window that overlaps an existing confirmed booking.
 *  Skip any candidate window that starts in the past.
 */
export function computeSlotsForDate(
	availabilities: Availability[],
	date: Date,
	existingBookings: { startTime: Date; endTime: Date }[],
): SlotWindow[] {
	const slots: SlotWindow[] = [];
	const activeAvailabilities = availabilities.filter((av) => av.status);
	const now = Date.now();

	// Midnight UTC of the requested date
	const midnight = new Date(date);
	midnight.setUTCHours(0, 0, 0, 0);

	for (const av of activeAvailabilities) {
		const startMinutes = toMinutes(av.startTime);
		const endMinutes = toMinutes(av.endTime);
		const step = av.slotDuration + av.bufferTime;

		for (
			let minuteOffset = startMinutes;
			minuteOffset + av.slotDuration <= endMinutes;
			minuteOffset += step
		) {
			const slotStart = new Date(midnight.getTime() + minuteOffset * 60_000);
			const slotEnd = new Date(
				midnight.getTime() + (minuteOffset + av.slotDuration) * 60_000,
			);

			// Skip past slots
			if (slotStart.getTime() <= now) continue;

			// Skip if overlaps a break
			if (
				overlapsBreaks(
					minuteOffset,
					minuteOffset + av.slotDuration,
					av.breakTimes,
				)
			) {
				continue;
			}

			// Skip if overlaps an existing booking
			if (overlapsBookings(slotStart, slotEnd, existingBookings)) continue;

			slots.push({ startTime: slotStart, endTime: slotEnd });
		}
	}

	slots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
	return deduplicateByStart(slots);
}

function overlapsBreaks(
	startMin: number,
	endMin: number,
	breaks: BreakTime[],
): boolean {
	for (const br of breaks) {
		const bStart = toMinutes(br.startTime);
		const bEnd = toMinutes(br.endTime);
		if (startMin < bEnd && endMin > bStart) return true;
	}
	return false;
}

function overlapsBookings(
	slotStart: Date,
	slotEnd: Date,
	bookings: { startTime: Date; endTime: Date }[],
): boolean {
	const sMs = slotStart.getTime();
	const eMs = slotEnd.getTime();
	return bookings.some(
		(b) => sMs < b.endTime.getTime() && eMs > b.startTime.getTime(),
	);
}

function deduplicateByStart(sorted: SlotWindow[]): SlotWindow[] {
	const seen = new Set<number>();
	return sorted.filter((s) => {
		const t = s.startTime.getTime();
		if (seen.has(t)) return false;
		seen.add(t);
		return true;
	});
}
