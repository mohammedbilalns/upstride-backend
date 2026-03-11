import pino from "pino";
import env from "../config/env";
import { RequestContext } from "../context/request-context";

const isProd = process.env.NODE_ENV === "production";

/**
 * Pino transport pipeline.
 *
 * two targets:
 *  - console output
 *  - Loki transport
 */
const transport = pino.transport({
	targets: [
		//  Console output using pino pretty
		{
			target: "pino-pretty",
			level: isProd ? "info" : "debug",
			options: {
				colorize: true,
				translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
				ignore: "pid,hostname",
			},
		},

		// Loki transport for centralized logging
		{
			target: "pino-loki",
			level: isProd ? "info" : "debug",
			options: {
				batching: true,
				interval: 5,
				host: env.LOKI_HOST,
				labels: { app: "upstride-backend", env: env.NODE_ENV },
				format: true,
			},
		},
	],
});

const logger = pino(
	{
		level: isProd ? "info" : "debug",
		timestamp: pino.stdTimeFunctions.unixTime,
		errorKey: "stack",
		mixin: () => {
			const requestId = RequestContext.getRequestId();
			return requestId ? { requestId } : {};
		},
	},
	transport,
);

export default logger;
