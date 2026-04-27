import type express from "express";
import { MongooseError } from "mongoose";
import { ErrorMessages, HttpStatus } from "../../../shared/constants";
import { BaseError } from "../../../shared/errors/base.error";
import logger from "../../../shared/logging/logger";

export function errorHandler(
	err: unknown,
	_req: express.Request,
	res: express.Response,
	_next: express.NextFunction,
) {
	// Application / Domain Errors
	if (err instanceof BaseError) {
		logger.error(`[${err.name}] ${err.message}`);

		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	}

	// Mongo Errors
	if (err instanceof MongooseError) {
		logger.error(`[MongoServerError] ${err.message}`);

		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: ErrorMessages.INTERNAL_SERVER_ERROR,
		});
	}

	// Unexpected Runtime Errors
	if (err instanceof Error) {
		logger.error(`[UnhandledError] ${err.stack}`);

		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: ErrorMessages.INTERNAL_SERVER_ERROR,
		});
	}

	// Unknown Errors
	logger.error(`[UnknownError] ${String(err)}`);

	return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
		success: false,
		message: ErrorMessages.INTERNAL_SERVER_ERROR,
	});
}
