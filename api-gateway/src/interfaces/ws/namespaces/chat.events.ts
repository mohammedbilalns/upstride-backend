import type { Socket } from "socket.io";
import { SocketPublisher } from "../socket.publisher";
import { SocketEvents } from "../../../common/enums/socketEvents";
import logger from "../../../utils/logger";
import { QueueEvents } from "../../../common/enums/queueEvents";
import { clientMessageSchema } from "../validations/messagePayload.validation";

export function registerChatEvents(
	//io: Server,
	socket: Socket,
	publisher: SocketPublisher,
) {

  socket.on(SocketEvents.SEND_MESSAGE, async (data)=> {
    try {
      const parsedData = clientMessageSchema.parse(data)
      const payload  = {
        ...parsedData,
        from: socket.data.user.id, 
      }
      logger.info(`[WS] Received message from user ${payload.from} -> ${payload.to}`);

      await publisher.publishToQueue(QueueEvents.SEND_MESSAGE,payload )

      publisher.emitToUser(payload.from, SocketEvents.SEND_MESSAGE, {
        status: "pending",
        ...payload
      })

      
    } catch (error) {
      logger.error("Error sending message", error);
    }
  })
}
