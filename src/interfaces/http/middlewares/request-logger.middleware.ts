import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { RequestContext } from "../../../shared/context/request-context";
import logger from "../../../shared/logging/logger";

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const start = Date.now();
	const requestId = randomUUID();

	res.setHeader("x-request-id", requestId);

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

	RequestContext.run({ requestId }, () => {
		next();
	});
};
