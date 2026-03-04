export interface File {
	originalname: string;
	buffer: Buffer;
	mimetype: string;
	size: number;
}
export interface IStorageService {
	upload(file: File, folder?: string): Promise<string>;
	delete(objectKey: string): Promise<void>;
	getSignedUrl(objectKey: string, expiresIn?: number): Promise<string>;
	getSignedUploadUrl(
		objectKey: string,
		mimetype: string,
		expiresIn?: number,
	): Promise<string>;
}
