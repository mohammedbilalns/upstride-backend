import type { NextFunction, Request, Response } from "express";
import logger from "../../../common/utils/logger";

/**
 * Middleware to log incoming HTTP requests.
 *
 * - Logs the HTTP method and request URL.
 * - Logs the request body.
 * - Passes control to the next middleware in the stack.
 *
 * @param req - Express request object.
 * @param _res - Express response object (unused).
 * @param next - Express next function.
 */

export const requestLogger = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	logger.info(`Recieved ${req.method} request to ${req.url}`);
	logger.info(`Request body, ${JSON.stringify(req.body)}`);
	next();
};
