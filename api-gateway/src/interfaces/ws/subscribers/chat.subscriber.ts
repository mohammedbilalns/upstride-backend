import { QueueEvents } from "../../../common/enums/queueEvents";
import { SocketEvents } from "../../../common/enums/socketEvents";
import { IEventBus } from "../../../domain/events/eventBus.interface";
import logger from "../../../utils/logger";
import { SocketPublisher } from "../socket.publisher";
import { messagePayloadSchema } from "../validations/messagePayload.validation";

export async function registerChatSubscriber(
  eventBus: IEventBus,
  socketPublisher: SocketPublisher
) {
  await eventBus.subscribe(QueueEvents.SAVED_MESSAGE, async (payload) => {
    try{
      logger.debug(`message payload received from the chat service: ${JSON.stringify(payload)}`)
      const parsedPayload = messagePayloadSchema.parse(payload)
      socketPublisher.emitToUser(parsedPayload.receiverId, SocketEvents.SEND_MESSAGE, parsedPayload)

      logger.info("[WS] Message delivered via Socket.IO");
    }catch(error){
      logger.error("[WS] Failed to emit saved message", error);
    }
  })
}
