import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { Request, Response, NextFunction } from "express";
import { getCacheService } from "../../../infrastructure/config/connectRedis";

export type RateLimitStrategy = "ip" | "user" | "route" | "global";

export function rateLimiter(
  limit: number,
  windowSec: number,
  strategy: RateLimitStrategy[] = ["ip"]
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheService = getCacheService(); 

      let keyParts: string[] = ["ratelimit"];

      if (strategy.includes("ip")) {
        keyParts.push(req.ip!);
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

      // Get current count
      let current = await cacheService.get(key);
      let count = current ? parseInt(current, 10) : 0;

      if (count === 0) {
        await cacheService.set(key, "1", windowSec);
        count = 1;
      } else {
        count++;
        await cacheService.set(key, count.toString(), windowSec); 
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

