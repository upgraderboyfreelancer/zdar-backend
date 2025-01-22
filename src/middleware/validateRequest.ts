import type { Request, Response, NextFunction } from 'express';
import type { AnyZodObject, ZodError, ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export const validateRequest = (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body, req.params)
    try {
      const data = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // console.log(`validated fields: `, data)
      return next();
    } catch (error) {
      const zodError = error as ZodError;
      // console.log(zodError.errors[0])
      return next(new AppError(zodError.errors[0].message, 400));
    }
  };
