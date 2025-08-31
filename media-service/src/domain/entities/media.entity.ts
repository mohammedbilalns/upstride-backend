export interface Media {
	id: string; 
	mediaType:"image" | "audio" | "document";
	category:"profile" | "article" | "chat" | "resume";
	publicId: string;
	originalName: string,
	url:string, 
	size:number,
	articleId?:string,
	chatMessageId?:string,
	mentorId?:string,
	userId: string; 
}
