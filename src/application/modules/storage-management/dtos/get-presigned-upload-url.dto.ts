export interface GetPreSignedUploadUrlInput {
	fileName: string;
	mimetype: string;
	category:
		| "resume"
		| "profile-picture"
		| "chat-media"
		| "article-featured-image";
}

export interface GetPreSignedUploadUrlOutput {
	url: string;
	fields: Record<string, string>;
	key: string;
}
