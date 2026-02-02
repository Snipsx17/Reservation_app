import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, align } = winston.format;

// Formato para archivos (sin colores)
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf((info) => {
    const context = info.context ? `[${info.context}] ` : '';
    return `[${info.timestamp}] ${info.level}: ${context}${info.message}`;
  }),
);

export const loggerConfig = {
  level: 'info',
  transports: [
    new winston.transports.DailyRotateFile({
      format: fileFormat,
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.File({
      format: fileFormat,
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
};
