export interface PresignedPostResponse {
	url: string;
	fields: Record<string, string>;
}

export interface IStorageService {
	delete(objectKey: string): Promise<void>;
	getSignedUrl(objectKey: string, expiresIn?: number): Promise<string>;
	getPublicUrl(objectKey: string): string;
	getPresignedPost(
		objectKey: string,
		mimetype: string,
		maxSizeBytes?: number,
		expiresIn?: number,
	): Promise<PresignedPostResponse>;
}
