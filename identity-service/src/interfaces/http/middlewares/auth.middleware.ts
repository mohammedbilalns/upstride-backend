import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { redisClient } from "../../../infrastructure/config";
import env from "../../../infrastructure/config/env";
import { RevokedUserRepository } from "../../../infrastructure/database/repositories/revokeduser.repository";

/**
 * Creates an authentication middleware for verifying JWT tokens.
 *
 * @param jwtSecret - Secret key used for verifying the JWT.
 * @returns Express middleware that handles authentication.
 */

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
			const isRevoked = await new RevokedUserRepository(redisClient).isRevoked(
				decoded.id,
			);
			if (isRevoked) {
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

/**
 * Default authentication middleware using the configured JWT secret.
 *
 * @param jwtSecret - Optional secret key, defaults to environment configuration.
 * @returns Express middleware that enforces authentication.
 */

export const authMiddleware = (jwtSecret: string = env.JWT_SECRET) => {
	return createAuthMiddleware(jwtSecret);
};

/**
 * Middleware for authorizing user roles.
 *
 * - Ensures that the authenticated user's role is included in the allowed roles.
 * - Denies access with a `403 Forbidden` response if unauthorized.
 *
 * @param allowedRoles - List of roles that are permitted access.
 * @returns Express middleware that enforces role-based access control.
 */

export const authorizeRoles = (
	...allowedRoles: ("user" | "admin" | "superadmin" | "mentor")[]
) => {
	const roles =
		allowedRoles.length === 1 && Array.isArray(allowedRoles[0])
			? allowedRoles[0]
			: allowedRoles;

	return (_req: Request, res: Response, next: NextFunction) => {
		try {
			if (!roles.includes(res.locals.user?.role)) {
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
