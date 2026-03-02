import type { NextFunction, Request, Response } from "express";
import logger from "../../../shared/logging/logger";

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		const { method, originalUrl } = req;
		const { statusCode } = res;

		const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

		if (statusCode >= 500) {
			logger.error(`[ERROR] ${message}`);
		} else if (statusCode >= 400) {
			logger.warn(`[WARN] ${message}`);
		} else {
			logger.info(`[SUCCESS] ${message}`);
		}
	});

	next();
};
