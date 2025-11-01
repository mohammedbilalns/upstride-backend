import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.errors({ stack: true }),
	winston.format.splat(),
	winston.format.json(),
);

const logger = winston.createLogger({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	format: logFormat,
	defaultMeta: { service: "media-service" },
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf(({ level, message, timestamp, stack }) => {
					return `${timestamp} [${level}]: ${stack || message}`;
				}),
			),
		}),

		new DailyRotateFile({
			filename: "logs/error-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			level: "error",
			maxSize: "20m",
			maxFiles: "14d",
			zippedArchive: true,
		}),

		new DailyRotateFile({
			filename: "logs/combined-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			maxSize: "20m",
			maxFiles: "14d",
			zippedArchive: true,
		}),
	],
});

export default logger;
