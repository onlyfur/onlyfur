import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AsyncRequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Prisma errors
  if (error.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Resource already exists'
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
  }

  // Default error
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
};
