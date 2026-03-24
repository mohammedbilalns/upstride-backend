export interface ChatMessage {
	id: string;
	chatId: string;
	senderId: string;
	content?: string;
	type: "TEXT" | "IMAGE" | "FILE";
	attachment?: { url: string; name: string; fileType: string; size: number };
	repliedTo?: string;
	status: "send" | "read";
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export class Chatmessage {
	constructor(
		public readonly id: string,
		public readonly chatId: string,
	) {}
}
