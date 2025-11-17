type Media = {
	url: string;
	name: string;
	fileType: string;
	size: number;
};
export interface SendMessageInput {
	from: string;
	to: string;
	message?: string;
	type: string;
	media?: Media;
	replyTo?: string;
}
