
export interface Notification {
	userId: string; 
	type:"chat"| "article"| "session"|"connection";
	title: string; 
	message: string; 
	link? : string; 
	isRead: boolean; 
	readAt: string; 
}
