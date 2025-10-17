import type { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../../../infra/config/env";
import logger from "../../../utils/logger";
import { redisClient } from "../../../infra/config/connectRedis";

export interface AuthUserPayload extends JwtPayload {
  id: string;
  email: string;
  role: "user" | "admin" | "superadmin" | "mentor";
}

/**
 * Socket.IO middleware for authenticating WebSocket connections via JWT.
 *
 * Extracts the token from the "accesstoken" cookie, verifies it,
 * and attaches the decoded user info to `socket.data.user`.
 *
 * On failure, calls `next(new Error("Unauthorized"))`.
 */
export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: ExtendedError) => void
): Promise<void> {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("accesstoken="))
      ?.split("=")[1];

    if (!token) {
      logger.warn(`[WS] Missing access token for socket ${socket.id}`);
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;

    // Check if user is revoked 
    const isRevoked = await redisClient.exists(`revokedUser:${decoded.id}`);
    if (isRevoked === 1) {
      logger.warn(`[WS] Blocked user attempted connection: ${decoded.id}`);
      return next(new Error("User blocked"));
    }

    // Attach decoded user info to socket
    socket.data.user = decoded;

    logger.info(
      `[WS] Auth success for socket ${socket.id}, userId: ${decoded.id}`
    );
    next();
  } catch (err: any) {
    logger.error(`[WS] Auth error for socket ${socket.id}: ${err.message}`);
    next(new Error("Unauthorized"));
  }
}

