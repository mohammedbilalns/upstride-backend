import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../../../infrastructure/config/env";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { redisClient } from "../../../infrastructure/config";
import { RevokedUserRepository } from "../../../infrastructure/database/repositories/revokeduser.repository";
import logger from "../../../common/utils/logger";

export const createAuthMiddleware = (jwtSecret: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accesstoken;
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: ErrorMessage.TOKEN_NOT_FOUND,
        });
      }
      const decoded = jwt.verify(token, jwtSecret) as {
        id: string;
        email: string;
        role: "user" | "admin" | "superadmin" | "expert";
      };
      const isRevoked = await new RevokedUserRepository(redisClient).isRevoked(
        decoded.id,
      );
      if (isRevoked) {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: ErrorMessage.BLOCKED_FROM_PLATFORM,
        });
      }

      res.locals.user = decoded;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: ErrorMessage.TOKEN_EXPIRED,
        });
      }
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: ErrorMessage.INVALID_TOKEN,
      });
    }
  };
};

export const authMiddleware = (jwtSecret: string = env.JWT_SECRET) => {
  return createAuthMiddleware(jwtSecret);
};


export const authorizeRoles = (
  ...allowedRoles: ("user" | "admin" | "superadmin" | "mentor")[]
) => {
  logger.info("Hit authorize roles middleware");
  
  
  const roles = allowedRoles.length === 1 && Array.isArray(allowedRoles[0]) 
    ? allowedRoles[0] 
    : allowedRoles;

  return (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!roles.includes(res.locals.user?.role)) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: ErrorMessage.FORBIDDEN_RESOURCE,
        });
        return;
      }
      return next();
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || ErrorMessage.FORBIDDEN_RESOURCE,
      });
      return;
    }
  };
};
