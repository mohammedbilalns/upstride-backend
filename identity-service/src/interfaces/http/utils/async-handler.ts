import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async Express route handler to automatically catch errors
 * and pass them to the next middleware (error handler).
 *
 * @param {RequestHandler} handler - The async route handler function to wrap.
 * @returns {RequestHandler} A new request handler with error handling.
 */

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
