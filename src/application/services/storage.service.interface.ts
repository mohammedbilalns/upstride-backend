export interface File {
	originalname: string;
	buffer: Buffer;
	mimetype: string;
	size: number;
}
export interface PresignedPostResponse {
	url: string;
	fields: Record<string, string>;
}

export interface IStorageService {
	upload(file: File, folder?: string): Promise<string>;
	delete(objectKey: string): Promise<void>;
	getSignedUrl(objectKey: string, expiresIn?: number): Promise<string>;
	getPublicUrl(objectKey: string): string;
	getSignedUploadUrl(
		objectKey: string,
		mimetype: string,
		expiresIn?: number,
	): Promise<string>;
	getPresignedPost(
		objectKey: string,
		mimetype: string,
		maxSizeBytes?: number,
		expiresIn?: number,
	): Promise<PresignedPostResponse>;
}
