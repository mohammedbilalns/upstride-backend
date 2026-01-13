import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary";
import env from "../config/env";
import type {
	IMediaStorageService,
	UploadOptions,
} from "../../domain/services/media-storage.service.interface";
import type {
	UploadMediaResponse,
	CreateSignatureResponse,
} from "../../application/dtos/media.dto";
import { AppError } from "../../application/errors/app-error";
import { ErrorMessage, HttpStatus } from "../../common/enums";

export class CloudinaryService implements IMediaStorageService {
	/**
	 * Upload a file buffer to Cloudinary
	 */
	async uploadFile(
		buffer: Buffer,
		options: UploadOptions,
	): Promise<UploadMediaResponse> {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					resource_type: options.resourceType,
					public_id: options.publicId,
				},
				(error, result) => {
					if (error) {
						return reject(
							new AppError(
								ErrorMessage.FAILED_TO_UPLOAD_MEDIA,
								HttpStatus.INTERNAL_SERVER_ERROR,
							),
						);
					}
					if (!result) {
						return reject(
							new AppError(
								ErrorMessage.FAILED_TO_UPLOAD_MEDIA,
								HttpStatus.INTERNAL_SERVER_ERROR,
							),
						);
					}

					resolve({
						public_id: result.public_id,
						secure_url: result.secure_url,
						original_filename: result.original_filename,
						resource_type: result.resource_type,
						bytes: result.bytes,
						asset_folder: result.asset_folder,
					});
				},
			);

			const bufferStream = new Readable();
			bufferStream.push(buffer);
			bufferStream.push(null);
			bufferStream.pipe(uploadStream);
		});
	}

	/**
	 * Generate a signed URL for accessing media
	 */
	generateSignedUrl(
		publicId: string,
		mediaType: string,
		expiresAt: number,
		authenticated = false,
	): string {
		const options: Parameters<typeof cloudinary.url>[1] = {
			sign_url: true,
			resource_type: mediaType,
			expires_at: expiresAt,
		};

		if (authenticated) {
			(options as Record<string, unknown>).type = "authenticated";
		}

		return cloudinary.url(publicId, options);
	}

	/**
	 * Delete a file from Cloudinary
	 */
	async deleteFile(publicId: string, resourceType: string): Promise<void> {
		await cloudinary.uploader.destroy(publicId, {
			resource_type: resourceType,
		});
	}

	/**
	 * Create upload signature for client-side uploads
	 */
	createSignature(): CreateSignatureResponse {
		const timestamp = Math.floor(Date.now() / 1000);

		const paramsToSign = {
			timestamp,
			upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
			type: "authenticated",
		};

		const signature = cloudinary.utils.api_sign_request(
			paramsToSign,
			env.CLOUDINARY_API_SECRET,
		);

		return {
			signature,
			timestamp,
			api_key: env.CLOUDINARY_API_KEY,
			cloud_name: env.CLOUDINARY_CLOUD_NAME,
			upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
		};
	}
}
