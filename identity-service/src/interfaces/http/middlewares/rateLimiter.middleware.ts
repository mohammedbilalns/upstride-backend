import type { NextFunction, Request, Response } from "express";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { redisClient } from "../../../infrastructure/config";

export type RateLimitStrategy = "ip" | "user" | "route" | "global";

/**
 * Creates a rate-limiting middleware for Express routes.
 *
 * - Limits the number of requests within a given time window.
 * - Supports multiple strategies to track request counts: IP, route, global.
 * - Uses Redis to store counters and expiration for each key.
 *
 * @param limit - Maximum number of requests allowed within the window.
 * @param windowSec - Time window in seconds.
 * @param strategy - Array of strategies to apply for rate limiting.
 *                   Defaults to ["ip"].
 * @returns Express middleware that enforces the rate limit.
 */

export function rateLimiter(
	limit: number,
	windowSec: number,
	strategy: RateLimitStrategy[] = ["ip"],
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const keyParts: string[] = ["ratelimit"];

			if (strategy.includes("ip")) {
				keyParts.push(req.ip!);
			}

			if (strategy.includes("route")) {
				keyParts.push(req.path);
			}

			if (strategy.includes("global")) {
				keyParts.push("global");
			}

			const key = keyParts.join(":");
			const count = await redisClient.incr(key);

			if (count === 1) {
				await redisClient.expire(key, windowSec);
			}

			if (count > limit) {
				return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
					message: ErrorMessage.TOO_MANY_REQUESTS,
					limit,
					windowSec,
				});
			}

			return next();
		} catch (err) {
			console.error("Rate limiter error:", err);
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: ErrorMessage.SERVER_ERROR });
		}
	};
}
