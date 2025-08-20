import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger";
import { AppError } from "../../../application/application/errors/AppError";
export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err instanceof AppError) {
		logger.error(`[AppError] ${err.message}`);
		return res.status(err.statusCode).json({ message: err.message });
	}

	if (err instanceof Error) {
		logger.error(`[Error] ${err.stack}`);
		return res.status(500).json({ message: err.message });
	}

	logger.error("[Unknown Error]", err);
	return res.status(500).json({ message: "Internal server error" });
}


