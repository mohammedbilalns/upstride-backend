import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { AppError } from "../../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import logger from "../../../common/utils/logger";

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
	if (err instanceof MulterError) {
		logger.error(`[MulterError] ${err.message}`);
		res
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.json({ success: false, message: err.message });
	}
	if (err instanceof Error) {
		logger.error(`[Error] ${err.stack}`);
		return res
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.json({ success: false, message: err.message });
	}

	logger.error(`[Unknown error] ${err}`);
	return res
		.status(HttpStatus.INTERNAL_SERVER_ERROR)
		.json({ success: false, message: ErrorMessage.INTERNAL_SERVER_ERROR });
}
