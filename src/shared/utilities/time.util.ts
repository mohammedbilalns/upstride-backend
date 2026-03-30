export function toMinutes(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}

export function isValidTimeRange(start: string, end: string): boolean {
	return toMinutes(start) < toMinutes(end);
}
