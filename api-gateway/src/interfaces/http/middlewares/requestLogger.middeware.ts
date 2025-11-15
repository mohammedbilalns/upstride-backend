import type { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger";

/**
 * Express middleware for logging incoming HTTP requests.
 *
 * Logs:
 * - HTTP method (GET, POST, etc.)
 * - Request URL
 */
export const requestLogger = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	// Log request method and URL at INFO level
	logger.info(`Received ${req.method} request to ${req.url}`);

	// Continue to next middleware or route
	next();
};

