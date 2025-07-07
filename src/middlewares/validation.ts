import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { BadRequestError } from './error';

// Middleware to validate request body, query, or params against a Joi schema
export const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: false }); // Validate req.body by default

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new BadRequestError(errorMessage));
  }

  next();
};

// You can extend this to validate query or params as well
export const validateQuery = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new BadRequestError(errorMessage));
  }

  next();
};

export const validateParams = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new BadRequestError(errorMessage));
  }

  next();
};