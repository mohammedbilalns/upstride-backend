import type {
	MessageStatus,
	MessageType,
} from "../entities/chat-message.entity";
import { DomainEvent } from "./domain-event";

export type ChatMessagePayload = {
	id: string;
	chatId: string;
	senderId: string;
	messageType: MessageType;
	content: string | null;
	attachementId: string | null;
	mediaUrl: string | null;
	repliedTo: string | null;
	status: MessageStatus;
	createdAt: Date;
	updatedAt: Date;
};

export class MessageSentEvent extends DomainEvent {
	readonly eventName = "chat.message.sent";

	constructor(
		public readonly payload: {
			chatId: string;
			receiverId: string;
			message: ChatMessagePayload;
			senderName: string;
			receiverName: string;
		},
	) {
		super();
	}
}
