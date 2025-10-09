
export interface Message {
	chatId: string;
	sender: string;
	receiver: string;
	content: string;
	media:{
		url: string; 
		type: string;
	}
	replyTo: string;
	status: "send"| "delivered"| "read";
	createdAt: Date;
}
