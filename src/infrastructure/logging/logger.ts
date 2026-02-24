import path from "node:path";
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const transport = pino.transport({
	targets: [
		//  Console output
		{
			target: "pino-pretty",
			level: isProd ? "info" : "debug",
			options: {
				colorize: true,
				translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
				ignore: "pid,hostname",
			},
		},

		// combined log file
		{
			target: "pino-roll",
			level: "info",
			options: {
				file: path.join("logs", "combined.log"),
				frequency: "daily",
				size: "20m", // max-size
				limit: { count: 14 }, // max-file count
				mkdir: true, // Auto-create dir
			},
		},

		// error log file
		{
			target: "pino-roll",
			level: "error",
			options: {
				file: path.join("logs", "error.log"),
				frequency: "daily",
				size: "20m",
				limit: { count: 14 },
				mkdir: true,
			},
		},
	],
});

const logger = pino(
	{
		level: isProd ? "info" : "debug",
		timestamp: pino.stdTimeFunctions.isoTime,
		errorKey: "stack",
	},
	transport,
);

export default logger;
