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

	const ip =
		req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.ip;

	const userAgent = req.headers["user-agent"] || "unknown";
	const referer = req.headers.referer || "unknown";

	res.on("finish", () => {
		const duration = Date.now() - start;
		const { method, originalUrl } = req;
		const { statusCode } = res;

		const logPayload = {
			requestId,
			method,
			url: originalUrl,
			statusCode,
			duration: `${duration}ms`,
			ip,
			userAgent,
			referer,
		};

		if (statusCode >= 500) {
			logger.error(logPayload, "request_error");
		} else if (statusCode >= 400) {
			logger.warn(logPayload, "request_warn");
		} else {
			logger.info(logPayload, "request_success");
		}
	});

	RequestContext.run({ requestId }, () => {
		next();
	});
};
