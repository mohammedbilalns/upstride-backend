import type { NextFunction, Request, Response } from "express";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { redisClient } from "../../../infrastructure/config";

export type RateLimitStrategy = "ip" | "user" | "route" | "global";

export function rateLimiter(
	limit: number,
	windowSec: number,
	strategy: RateLimitStrategy[] = ["ip"],
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const keyParts: string[] = ["ratelimit"];

			if (strategy.includes("ip") && req.ip) {
				keyParts.push(req.ip);
			}

			// if (strategy.includes("user") && req.user?.id) {
			//   keyParts.push(`user:${req.user.id}`);
			// }

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
