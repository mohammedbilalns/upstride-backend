import pino from "pino";
import env from "../config/env";
import { RequestContext } from "../context/request-context";

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
			level: env.LOG_LEVEL,
			options: {
				colorize: true,
				translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
				ignore: "pid,hostname",
			},
		},

		// Loki transport
		{
			target: "pino-loki",
			level: env.LOG_LEVEL,
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
		level: env.LOG_LEVEL,
		timestamp: pino.stdTimeFunctions.unixTime,
		errorKey: "stack",
		mixin: () => {
			const requestId = RequestContext.getRequestId();
			return requestId ? { requestId } : {};
		},
		redact: ["password", "token", "apiKey", "req.headers.authorization"],
	},
	transport,
);

export default logger;
