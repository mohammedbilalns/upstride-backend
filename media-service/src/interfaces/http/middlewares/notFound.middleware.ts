import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../common/enums";
export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
	res.status(HttpStatus.NOT_FOUND).json({ message: "Invalid resource" });
};
