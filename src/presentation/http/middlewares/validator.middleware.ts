import type express from "express";
import { ZodError, type ZodType } from "zod";
import { HttpStatus } from "../../../shared/constants";
import logger from "../../../shared/logging/logger";

interface ValidatedRequestData {
	body?: unknown;
	params?: unknown;
	query?: unknown;
}

export const validate =
	(schema: { body?: ZodType; params?: ZodType; query?: ZodType }) =>
	(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	): void => {
		try {
			logger.debug({ body: req.body }, "Request body");
			logger.debug({ params: req.params }, "Request params");
			logger.debug({ query: req.query }, "Request query");

			const validated: ValidatedRequestData = {};

			if (schema.body) {
				validated.body = schema.body.parse(req.body);
			}

			if (schema.params) {
				validated.params = schema.params.parse(req.params);
			}

			if (schema.query) {
				validated.query = schema.query.parse(req.query);
			}

			req.validated = validated;

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = error.issues.map((e) => ({
					path: e.path.join("."),
					message: e.message,
				}));
				res.status(HttpStatus.BAD_REQUEST).json({
					success: false,
					message: errors[0].message,
					errors,
				});
				return;
			}

			next(error);
		}
	};
