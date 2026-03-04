import "express";
import { UserRole } from "../../domain/entities/user.entity";

declare global {
	namespace Express {
		interface Request {
			validated?: {
				body?: unknown;
				params?: unknown;
				query?: unknown;
			};
			user?: {
				id: string;
				role: UserRole;
			};
		}
	}
}
