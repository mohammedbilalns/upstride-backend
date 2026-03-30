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
