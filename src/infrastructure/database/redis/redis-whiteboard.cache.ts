import { inject, injectable } from "inversify";
import type { Redis } from "ioredis";
import type { IWhiteboardCache } from "../../../application/services/whiteboard-cache.interface";
import { TYPES } from "../../../shared/types/types";

const WHITEBOARD_CACHE_PREFIX = "whiteboard:state:booking_";

@injectable()
export class RedisWhiteboardCache implements IWhiteboardCache {
	constructor(
		@inject(TYPES.Databases.Redis)
		private readonly _redis: Redis,
	) {}

	/**
	 * Fetches the current whiteboard state for a specific booking.
	 * Returns the parsed JSON state or null if not found.
	 */
	async get(bookingId: string): Promise<any | null> {
		const cached = await this._redis.get(
			`${WHITEBOARD_CACHE_PREFIX}${bookingId}`,
		);

		if (!cached) {
			return null;
		}

		try {
			return JSON.parse(cached);
		} catch {
			return null;
		}
	}

	/**
	 * Updates the whiteboard state for a specific booking.
	 * Stores the state as a JSON string with a 24-hour TTL.
	 */
	async set(bookingId: string, state: any): Promise<void> {
		await this._redis.set(
			`${WHITEBOARD_CACHE_PREFIX}${bookingId}`,
			JSON.stringify(state),
			"EX",
			60 * 60 * 24, // 24 hours
		);
	}

	/**
	 * Clears the whiteboard state for a specific booking.
	 */
	async clear(bookingId: string): Promise<void> {
		await this._redis.del(`${WHITEBOARD_CACHE_PREFIX}${bookingId}`);
	}
}
