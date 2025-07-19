import config from "@/config";
import winston, { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { combine, timestamp, label, printf } = format;

interface LoggingInfo {
  level: string;
  message: string;
}

const customFormat = () => {
  return combine(
    label({ label: "CustomLabel" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ timestamp, level, message, label }) => {
      let emoji = "";

      // Set emoji based on log level
      switch (level) {
        case "error":
          emoji = "❌";
          break;
        case "warn":
          emoji = "⚠️";
          break;
        case "info":
          emoji = "ℹ️";
          break;
        case "debug":
          emoji = "🔍";
          break;
        default:
          emoji = "✉️";
          break;
      }

      // Format the log message
      return `${emoji} [${timestamp}] [${label}] [${level.toUpperCase()}]: ${message}`;
    })
  );
};

// Create separate transports for success and error logs
const successTransport = new DailyRotateFile({
  dirname: "./logs/success",
  filename: "%DATE%-success.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true, // Enable compression
  maxSize: "20m",
  maxFiles: "7d",
});

const errorTransport = new DailyRotateFile({
  dirname: "./logs/error",
  filename: "%DATE%-error.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true, // Enable compression
  maxSize: "20m",
  maxFiles: "7d",
});

export const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: customFormat(),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
    successTransport,
    errorTransport,
  ],
});
