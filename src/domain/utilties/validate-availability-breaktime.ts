import { toMinutes } from "../../shared/utilities/time.util";
import type { BreakTime } from "../entities/availability.entity";

export function validateBreaks(
	breaks: BreakTime[],
	availabilityStart: string,
	availabilityEnd: string,
) {
	const MAX_BREAKS = 3;

	if (breaks.length > MAX_BREAKS) {
		return `Maximum ${MAX_BREAKS} breaks allowed`;
	}

	const parsed = breaks.map((b) => ({
		start: toMinutes(b.startTime),
		end: toMinutes(b.endTime),
	}));

	const availabilityStartMin = toMinutes(availabilityStart);
	const availabilityEndMin = toMinutes(availabilityEnd);

	for (const b of parsed) {
		if (b.start >= b.end) {
			return "Break start must be before end";
		}

		if (b.start < availabilityStartMin || b.end > availabilityEndMin) {
			return "Break must be within availability time";
		}
	}

	// check overlap
	parsed.sort((a, b) => a.start - b.start);

	for (let i = 1; i < parsed.length; i++) {
		if (parsed[i].start < parsed[i - 1].end) {
			return "Break times cannot overlap";
		}
	}
	return null;
}
