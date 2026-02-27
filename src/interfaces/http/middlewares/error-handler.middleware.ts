import type { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { DomainError, NotFoundError } from "../../../domain/errors";
import { HttpStatus } from "../../../shared/constants/http-status-codes";
import { ErrorMessage } from "../../../shared/constants/responses-messages";
import logger from "../../../shared/logging/logger";

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof DomainError) {
		logger.error(`[DomainError] ${err.name}: ${err.message}`);
		let status: number = HttpStatus.INTERNAL_SERVER_ERROR;

		if (err instanceof NotFoundError) status = HttpStatus.NOT_FOUND;
		return res.status(status).json({ success: false, message: err.message });
	}

	if (err instanceof MongoServerError) {
		logger.error(`[MongoServerError] ${err.message}`);

		return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: ErrorMessage.INTERNAL_SERVER_ERROR,
		});
	}

	if (err instanceof Error) {
		logger.error(`[Error] ${err.stack}`);
		return res
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.json({ success: false, message: err.message });
	}

	logger.error(`[Unknown] ${err}`);
	return res
		.status(HttpStatus.INTERNAL_SERVER_ERROR)
		.json({ success: false, message: ErrorMessage.INTERNAL_SERVER_ERROR });
}
