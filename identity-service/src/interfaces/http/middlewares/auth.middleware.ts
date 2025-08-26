import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../../../infrastructure/config/env";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { redisClient } from "../../../infrastructure/config";

export const createAuthMiddleware = (jwtSecret: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
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
      const isRevoked = await redisClient.sismember(
        "revoked_users",
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
  ...allowedRoles: ("user" | "admin" | "superadmin" | "expert")[]
) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!allowedRoles.includes(res.locals.user?.role)) {
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
