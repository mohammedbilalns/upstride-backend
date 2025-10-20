export interface Notification {
	userId: string;
	type: "chat" | "article" | "session" | "connection";
	title: string;
	content: string;
	link?: string;
	isRead: boolean;
}
