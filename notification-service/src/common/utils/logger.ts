
import pino from "pino";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const transport = pino.transport({
  targets: [
    //  Console output using pino-pretty
    {
      target: "pino-pretty",
      level: isProd ? "info" : "debug", 
      options: {
        colorize: true,                                
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",       // Human-readable timestamps
        ignore: "pid,hostname",                         // Remove noisy fields
      },
    },

    // Combined logs (info and above) with daily rotation
    {
      target: "pino-roll",
      level: "info",
      options: {
        file: path.join("logs", "combined.log"), // Output file
        frequency: "daily",                      // Rotate logs daily
        size: "20m",                             // Rotate if file exceeds 20 MB
        limit: { count: 14 },                    // Keep last 14 log files
        mkdir: true,                             // Auto-create logs directory
      },
    },

    //  Error-only log file with daily rotation
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

//  main logger instance
const logger = pino(
  {
    level: isProd ? "info" : "debug", 
    base: { service: "notification-service" },
    timestamp: pino.stdTimeFunctions.isoTime,  // ISO timestamp format
    errorKey: "stack",                         // Use `stack` key for error logs
  },
  transport
);

export default logger;

