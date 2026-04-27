import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../../domain/entities/user.entity";
import { HttpStatus } from "../../../shared/constants";

export const authorizeRoles = (roles: UserRole[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			res.status(HttpStatus.FORBIDDEN).json({
				success: false,
				message: "Forbidden: Insufficient permissions",
			});
			return;
		}
		next();
	};
};
