import type { NextFunction, Request, Response } from "express";
import logger from "./logger";

export const requestLogger = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	logger.info(`Recieved ${req.method} request to ${req.url}`);
	logger.info(`Request body, ${req.body}`);
	next();
};
