import { IST_OFFSET_MINUTES } from "../constants/app.constants";

export const DAY_MS = 24 * 60 * 60 * 1000;
export function toMinutes(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}

export function isValidTimeRange(start: string, end: string): boolean {
	return toMinutes(start) < toMinutes(end);
}

/**
 * Converts Date to a "HH:MM" string in UTC.
 */
export function toHHMM(date: Date): string {
	const h = date.getUTCHours().toString().padStart(2, "0");
	const m = date.getUTCMinutes().toString().padStart(2, "0");
	return `${h}:${m}`;
}

/**
 * Converts a Date to a "YYYY-MM-DD" string in UTC.
 */
export function toDateString(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function istDateStringTimeToUtcIso(
	dateStr: string,
	time: string,
): string {
	const [year, month, day] = dateStr.split("-").map(Number);
	const [hour, minute] = time.split(":").map(Number);
	const utcMs =
		Date.UTC(year, month - 1, day, hour, minute) - IST_OFFSET_MINUTES * 60_000;
	return new Date(utcMs).toISOString();
}

export function getUtcRangeForIstDate(date: Date): {
	start: Date;
	end: Date;
} {
	const dateStr = toDateString(date);
	const [year, month, day] = dateStr.split("-").map(Number);
	const startMs =
		Date.UTC(year, month - 1, day, 0, 0, 0, 0) - IST_OFFSET_MINUTES * 60_000;
	const endMs =
		Date.UTC(year, month - 1, day, 23, 59, 59, 999) -
		IST_OFFSET_MINUTES * 60_000;
	return { start: new Date(startMs), end: new Date(endMs) };
}
