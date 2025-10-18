import type { NextFunction, Request, Response } from "express";
import logger from "../../../common/utils/logger";

export const requestLogger = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	logger.info(`Recieved ${req.method} request to ${req.url}`);
	logger.info(`Request body, ${ JSON.stringify(req.body)}`);
	next();
};
