/**
 * Determines whether a notification should be sent based on the current count of an action (e.g., likes, comments).
 * Implements an aggregation pattern to reduce notification fatigue.
 *
 */
export function shouldNotify(count: number): boolean {
	if (count <= 3) return true;

	if (count <= 10) return count === 5 || count === 10;

	if (count <= 50) return count % 10 === 0;

	if (count <= 200) return count % 50 === 0;

	if (count <= 1000) return count % 100 === 0;

	return count % 500 === 0;
}
