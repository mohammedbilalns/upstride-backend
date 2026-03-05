export interface GetPreSignedUploadUrlInput {
	fileName: string;
	mimetype: string;
	category: "resume" | "profile-picture";
}

export interface GetPreSignedUploadUrlOutput {
	uploadUrl: string;
	key: string;
}
