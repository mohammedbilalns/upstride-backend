import type { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (handler: RequestHandler): RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await handler(req, res, next);
		} catch (err) {
			next(err);
		}
	};
};

export default asyncHandler;
