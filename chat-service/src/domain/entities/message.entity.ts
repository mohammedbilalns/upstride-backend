export interface Message {
  id: string;
	chatId: string;
	senderId: string;
	content: string;
  type: "TEXT" | "IMAGE" | "FILE" 
  attachments?: string[];
  repliedTo?: string;
	status: "send"| "delivered"| "read";
	createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
