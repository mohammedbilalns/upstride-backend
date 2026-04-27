import type { NextFunction, Request, Response } from "express";

export const asyncHandler = <T extends Request = Request>(
	handler: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(handler(req as T, res, next)).catch(next);
	};
};
