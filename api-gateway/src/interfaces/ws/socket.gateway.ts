import { Server } from "socket.io";
import env from "../../infra/config/env";
import logger from "../../utils/logger";
import EventBus from "../../infra/events/eventBus";
import { socketAuthMiddleware } from "../http/middlewares/socket.middleware";

const userSockets = new Map<string, any>();

export function initSocket(server: any) {
  logger.info("[WS] Initializing Socket.IO server...");
  const io = new Server(server, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;
    logger.info(`[WS] Connected: socket.id=${socket.id}, userId=${userId}`);
    userSockets.set(userId, socket);

    socket.on("disconnect", () => {
      logger.info(`[WS] Disconnected: userId=${userId}`);
      userSockets.delete(userId);
    });
  });

  EventBus.subscribe<{ userId: string; type: string; data: any }>(
    "gateway.events",
    async (payload) => {
      const socket = userSockets.get(payload.userId);
      if (socket) socket.emit(payload.type, payload.data);
    },
  );

  logger.info("[WS] Socket.IO server initialized.");
  return io;
}

