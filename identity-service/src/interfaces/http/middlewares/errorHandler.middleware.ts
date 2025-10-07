import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import logger from "../../../common/utils/logger";

/**
 * Global error handling middleware for the application.
 *
 * - Handles different error types consistently and returns structured JSON responses.
 * - ZodError → Validation errors with details about invalid fields.
 * - AppError → Custom application errors with explicit status codes.
 * - Error → Generic runtime errors with stack trace logging.
 * - Unknown → Catches anything else as an internal server error.
 *
 * @param err - The error object thrown in the request lifecycle.
 * @param _req - The Express request object (unused).
 * @param res - The Express response object.
 * @param _next - The Express next function (unused, required for signature).
 * @returns JSON response with error details and appropriate HTTP status.
 */
export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof ZodError) {
		logger.error(`[ZodError] ${err.message}`);
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: ErrorMessage.VALIDATION_FAILED,
			errors: err.issues.map((e) => ({
				path: e.path.join("."),
				message: e.message,
			})),
		});
	}
	if (err instanceof AppError) {
		logger.error(`[AppError] ${err.message}`);
		return res
			.status(err.statusCode)
			.json({ success: false, message: err.message });
	}

	if (err instanceof Error) {
		logger.error(`[Error] ${err.stack}`);
		return res
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.json({ success: false, message: err.message });
	}

	logger.error("[Unknown Error]", err);
	return res
		.status(HttpStatus.INTERNAL_SERVER_ERROR)
		.json({ success: false, message: ErrorMessage.INTERNAL_SERVER_ERROR });
}
