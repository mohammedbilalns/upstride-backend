import type { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";

export const proxyOptions = {
	proxyReqPathResolver: (req: Request) => {
		return req.originalUrl.replace(/^\/v1/, "/api");
	},
	proxyErrorHandler: (err: Error, res: Response, _next: NextFunction) => {
		logger.error(`Proxy error: ${err.message}`);
		res
			.status(500)
			.json({ message: `Internal server error `, error: err?.message });
	},
};
