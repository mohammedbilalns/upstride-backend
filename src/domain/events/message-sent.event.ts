import type { ChatMessageDto } from "../../application/modules/chat-management/dtos/chat.dto";
import type { AppEvent } from "./domain-event";

export class MessageSentEvent implements AppEvent {
	readonly eventName = "chat.message.sent";
	readonly occurredAt = new Date();

	constructor(
		public readonly chatId: string,
		public readonly receiverId: string,
		public readonly message: ChatMessageDto,
		public readonly senderName: string,
		public readonly receiverName: string,
	) {}
}
