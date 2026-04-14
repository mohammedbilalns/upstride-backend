export interface IWhiteboardCache {
	/**
	 * Fetches the current whiteboard state for a specific booking.
	 */
	get(bookingId: string): Promise<any | null>;

	/**
	 * Updates the whiteboard state for a specific booking.
	 */
	set(bookingId: string, state: any): Promise<void>;

	/**
	 * Clears the whiteboard state for a specific booking.
	 */
	clear(bookingId: string): Promise<void>;
}
