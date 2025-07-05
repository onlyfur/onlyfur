import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Winston logger configuration
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}] ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'onlyfur-api' },
  transports: [
    // Write all logs to file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args: any[]) {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0,
      timestamp: new Date().toISOString()
    });

    // Call the original end method
    originalEnd.apply(this, args);
  };

  next();
};

// API operation logger
export const logApiOperation = (operation: string, details?: any) => {
  logger.info(`API Operation: ${operation}`, details);
};

// Security event logger
export const logSecurityEvent = (event: string, details?: any) => {
  logger.warn(`Security Event: ${event}`, {
    ...details,
    timestamp: new Date().toISOString(),
    severity: 'security'
  });
};

// Database operation logger
export const logDatabaseOperation = (operation: string, table: string, details?: any) => {
  logger.debug(`Database Operation: ${operation}`, {
    table,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// Payment operation logger
export const logPaymentOperation = (operation: string, details?: any) => {
  logger.info(`Payment Operation: ${operation}`, {
    ...details,
    timestamp: new Date().toISOString(),
    category: 'payment'
  });
};

// File operation logger
export const logFileOperation = (operation: string, details?: any) => {
  logger.info(`File Operation: ${operation}`, {
    ...details,
    timestamp: new Date().toISOString(),
    category: 'file'
  });
};

export default logger;
