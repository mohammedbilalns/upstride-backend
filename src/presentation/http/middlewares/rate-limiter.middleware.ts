import type { Request } from "express";
import rateLimit from "express-rate-limit";
import { type RedisReply, RedisStore } from "rate-limit-redis";
import { redisClient } from "../../../infrastructure/database/redis/redis.connection";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";

export function rateLimiter(
	limit: number,
	windowSec: number,
	strategy: ("ip" | "user" | "route" | "global")[],
) {
	return rateLimit({
		windowMs: windowSec * 1000,
		max: limit,
		standardHeaders: true,
		legacyHeaders: false,

		store: new RedisStore({
			sendCommand: (command: string, ...args: string[]) =>
				redisClient.call(command, ...args) as Promise<RedisReply>,
		}),

		keyGenerator: (req: Request) => {
			const keyParts = ["rateLimit"];

			if (strategy.includes("ip")) {
				keyParts.push(req.ip ?? "unknown");
			}

			if (strategy.includes("user")) {
				keyParts.push(
					(req as Partial<AuthenticatedRequest>).user?.id ?? "anonymous",
				);
			}

			if (strategy.includes("route")) {
				keyParts.push(req.route?.path ?? req.path);
			}

			if (strategy.includes("global")) {
				keyParts.push("global");
			}

			return keyParts.join(":");
		},

		handler: (_req, res) => {
			res.status(HttpStatus.TOO_MANY_ATTEMPTS).json({
				success: false,
				message: "Too many requests, please try again later.",
			});
		},
	});
}
