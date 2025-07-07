import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found', stack = '') {
    super(404, message, true, stack);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', stack = '') {
    super(400, message, true, stack);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', stack = '') {
    super(401, message, true, stack);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', stack = '') {
    super(403, message, true, stack);
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = 'Something went wrong';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message, isOperational } = error as ApiError;

  const response = {
    code: statusCode,
    message: isOperational ? message : 'Something went wrong',
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  };

  if (config.nodeEnv === 'development') {
    logger.error(error);
  } else {
    logger.error(message);
  }

  res.status(statusCode).send(response);
};

// Import config for error handler
import { config } from '../config';