import { NextFunction, Request, Response } from "express";

export const asyncHandler = <T extends Request = Request>(
	handler: (req: T, res: Response, next: NextFunction) => Promise<any>,
) => {
	return (req: T, res: Response, next: NextFunction) => {
		Promise.resolve(handler(req, res, next)).catch(next);
	};
};
