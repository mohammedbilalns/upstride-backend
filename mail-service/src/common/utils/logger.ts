import pino from "pino";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      level: isProd ? "info" : "debug",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
    {
      target: "pino-roll",
      level: "info",
      options: {
        file: path.join("logs", "combined.log"),
        frequency: "daily",
        size: "20m",
        limit: { count: 14 },
        mkdir: true,
      },
    },
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
    }
  ],

});

const logger = pino({
  level: isProd ? "info" : "debug",
  base: { service: "chat-service" },
  timestamp: pino.stdTimeFunctions.isoTime,
  errorKey: "stack",
}, transport);

export default logger;

