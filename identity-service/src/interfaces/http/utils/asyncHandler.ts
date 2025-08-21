import { Request, Response, NextFunction, RequestHandler } from 'express';
import logger from '../../../common/utils/logger';
import { AppError } from '../../../application/errors/AppError';

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      logger.error(`[AppError] ${err.message} stack: ${err.stack}`);
      if (err instanceof AppError) {
        res.status(err.statusCode).json({
          message: err.message,
        });
        return;
      }
      res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    }
  }
}

export default asyncHandler;