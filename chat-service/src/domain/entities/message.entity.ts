export interface Message {
	id: string;
	chatId: string;
	senderId: string;
	content?: string;
	type: "TEXT" | "FILE";
	attachment?: { url: string; fileType?: string; size?: number };
	repliedTo?: string;
	status: "send" | "delivered" | "read";
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}
