export interface Notification {
	id: string;
	userId: string;
	type: "chat" | "article" | "session" | "connection";
	title: string;
	content: string;
	link?: string;
	isRead: boolean;
	createdAt: Date;
}
