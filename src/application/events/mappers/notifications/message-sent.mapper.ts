import type { MessageSentEvent } from "../../../../domain/events/message-sent.event";

export const mapMessageSentToRealtime = (event: MessageSentEvent) => ({
	userId: event.payload.receiverId,
	channel: "chat:message",
	payload: {
		chatId: event.payload.chatId,
		message: event.payload.message,
	},
});
