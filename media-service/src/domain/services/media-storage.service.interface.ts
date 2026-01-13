import type {
	UploadMediaResponse,
	CreateSignatureResponse,
} from "../../application/dtos/media.dto";

export interface UploadOptions {
	resourceType: "image" | "video" | "raw" | "auto";
	publicId?: string;
}

export interface IMediaStorageService {
	/**
	 * Upload a file buffer to storage
	 */
	uploadFile(
		buffer: Buffer,
		options: UploadOptions,
	): Promise<UploadMediaResponse>;

	/**
	 * Generate a signed URL for accessing media
	 */
	generateSignedUrl(
		publicId: string,
		mediaType: string,
		expiresAt: number,
		authenticated?: boolean,
	): string;

	/**
	 * Delete a file from Cloudinary
	 */
	deleteFile(publicId: string, resourceType: string): Promise<void>;

	/**
	 * Create upload signature for client-side uploads
	 */
	createSignature(): CreateSignatureResponse;
}
