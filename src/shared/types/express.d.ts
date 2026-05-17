import "express";
import type { UserRole } from "../../domain/entities/user.entity";

// Augment Express.Request with custom properties set by middleware
declare global {
	namespace Express {
		interface Request {
			/** Parsed & validated request body/params/query (set by validation middleware) */
			validated?: {
				body?: unknown;
				params?: unknown;
				query?: unknown;
			};
			/** Authenticated user (set by auth middleware) */
			user?: {
				id: string;
				role: UserRole;
				sid: string;
			};
		}
	}
}
