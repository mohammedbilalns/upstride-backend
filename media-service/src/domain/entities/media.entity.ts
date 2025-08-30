export interface Media {
	id: string; 
	mediaType:"image" | "audio" | "document";
	publicId: string;
	originalName: string,
	url:string, 
	userId: string; 
}
