/**
 * Converts a time string ("HH:mm") into a Date object.
 *
 * Example:
 *   timeToDate("09:30") → Date(today at 09:30:00)
 */
export function timeToDate(time: string): Date {
	const [h, m] = time.split(":").map(Number);

	// Create a Date for
	const d = new Date();
	d.setHours(h, m, 0, 0);
	return d;
}

/**
 * Converts a time string ("HH:mm") into total minutes from midnight.
 *
 * Example:
 *   timeToMinutes("09:30") → 570
 *   (9 * 60 + 30 = 570)
 */
export function timeToMinutes(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}

/**
 * Converts a Date object into total minutes from midnight.
 *
 * Example:
 *   dateToMinutes(new Date("2025-01-01T09:30:00Z")) → 570 (depending on local timezone)
 */
export function dateToMinutes(date: Date): number {
	return date.getHours() * 60 + date.getMinutes();
}
