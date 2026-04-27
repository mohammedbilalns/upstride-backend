import { inject, injectable } from "inversify";
import type { Redis } from "ioredis";
import type {
	IWhiteboardCache,
	WhiteboardState,
} from "../../../application/services/whiteboard-cache.interface";
import { TYPES } from "../../../shared/types/types";

const WHITEBOARD_CACHE_PREFIX = "whiteboard:state:booking_";

@injectable()
export class RedisWhiteboardCache implements IWhiteboardCache {
	constructor(
		@inject(TYPES.Databases.Redis)
		private readonly _redis: Redis,
	) {}

	/**
	 * Fetches the current whiteboard state for a specific room.
	 */
	async get(roomId: string): Promise<WhiteboardState | null> {
		const cached = await this._redis.get(`${WHITEBOARD_CACHE_PREFIX}${roomId}`);

		if (!cached) {
			return null;
		}

		try {
			return JSON.parse(cached) as WhiteboardState;
		} catch {
			return null;
		}
	}

	/**
	 * Updates the whiteboard state for a specific booking.
	 */
	async set(roomId: string, state: WhiteboardState): Promise<void> {
		await this._redis.set(
			`${WHITEBOARD_CACHE_PREFIX}${roomId}`,
			JSON.stringify(state),
			"EX",
			60 * 60 * 2,
		);
	}

	/**
	 * Clears the whiteboard state for a specific room.
	 */
	async clear(bookingId: string): Promise<void> {
		await this._redis.del(`${WHITEBOARD_CACHE_PREFIX}${bookingId}`);
	}
}
