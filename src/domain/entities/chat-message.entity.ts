export const MessageTypeValues = ["TEXT", "IMAGE", "FILE"];
export type MessageType = (typeof MessageTypeValues)[number];

export const MessageStatusValues = ["send", "read"];
export type MessageStatus = (typeof MessageStatusValues)[number];

export class Chatmessage {
	constructor(
		public readonly id: string,
		public readonly chatId: string,
		public readonly senderId: string,
		public readonly messageType: MessageType,
		public readonly content: string | null,
		public readonly attachementId: string | null,
		public readonly repliedTo: string | null,
		public readonly status: MessageStatus,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}
}
