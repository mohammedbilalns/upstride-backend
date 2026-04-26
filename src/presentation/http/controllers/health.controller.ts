import type { Request, Response } from "express";
import { HttpStatus } from "../../../shared/constants";
import { getSystemHealthSnapshot } from "../../../shared/utilities/health-check.util";

/**
 * Main health check endpoint handler.
 */
export const healthCheckHandler = async (_req: Request, res: Response) => {
	const snapshot = await getSystemHealthSnapshot();

	res
		.status(
			snapshot.status === "ok" ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
		)
		.json(snapshot);
};
