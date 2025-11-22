import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import logger from "../../../common/utils/logger";
import { redisClient } from "../../../infrastructure/config/connectRedis";
import env from "../../../infrastructure/config/env";

export const createAuthMiddleware = (jwtSecret: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.cookies.accesstoken;
			if (!token) {
				return res.status(HttpStatus.UNAUTHORIZED).json({
					success: false,
					message: ErrorMessage.TOKEN_NOT_FOUND,
				});
			}
			const decoded = jwt.verify(token, jwtSecret) as {
				id: string;
				email: string;
				role: "user" | "admin" | "superadmin" | "expert";
			};

			const isRevoked = await redisClient.exists(`revokedUser:${decoded.id}`);
			if (isRevoked === 1) {
				return res.status(HttpStatus.FORBIDDEN).json({
					success: false,
					message: ErrorMessage.BLOCKED_FROM_PLATFORM,
				});
			}

			res.locals.user = decoded;
			return next();
		} catch (err) {
			if (err.name === "TokenExpiredError") {
				return res.status(HttpStatus.UNAUTHORIZED).json({
					success: false,
					message: ErrorMessage.TOKEN_EXPIRED,
				});
			}
			return res.status(HttpStatus.UNAUTHORIZED).json({
				success: false,
				message: ErrorMessage.INVALID_TOKEN,
			});
		}
	};
};

export const authMiddleware = (jwtSecret: string = env.JWT_SECRET) => {
	return createAuthMiddleware(jwtSecret);
};

export const authorizeRoles = (
	...allowedRoles: ("user" | "admin" | "superadmin" | "expert")[]
) => {
	logger.info("Hit authorize roles middleware");
	return (_req: Request, res: Response, next: NextFunction) => {
		try {
			if (!allowedRoles.includes(res.locals.user?.role)) {
				res.status(HttpStatus.FORBIDDEN).json({
					success: false,
					message: ErrorMessage.FORBIDDEN_RESOURCE,
				});
				return;
			}
			return next();
		} catch (error) {
			res.status(HttpStatus.UNAUTHORIZED).json({
				success: false,
				message: error.message || ErrorMessage.FORBIDDEN_RESOURCE,
			});
			return;
		}
	};
};
