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
		const { method, url } = req;
		const { statusCode } = res;

		const statusLevel =
			statusCode >= 500 ? "ERROR" : statusCode >= 400 ? "WARN" : "SUCCESS";

		logger.info(
			`[${statusLevel}] ${method} ${url} ${statusCode} - ${duration}ms`,
		);
	});

	next();
};
