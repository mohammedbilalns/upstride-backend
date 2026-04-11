export interface MailMessage {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

//
export interface IMailService {
	send(message: MailMessage): Promise<void>;
}
