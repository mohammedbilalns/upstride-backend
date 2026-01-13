import sharp from "sharp";
import type { IMediaStorageService } from "../../domain/services/mediaStorage.service.interface";
import type { IUploadMediaUC } from "../../domain/useCases/uploadMedia.uc.interface";
import type { UploadMediaDto, UploadMediaResponse } from "../dtos/media.dto";
import logger from "../../common/utils/logger";

export class UploadMediaUC implements IUploadMediaUC {
	constructor(private _mediaStorageService: IMediaStorageService) {}

	async execute(uploadDetails: UploadMediaDto): Promise<UploadMediaResponse> {
		const { file, resourceType } = uploadDetails;
		let fileBuffer = file.buffer;

		// Optimize images using sharp
		if (resourceType === "image") {
			try {
				fileBuffer = await sharp(file.buffer)
					.resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
					.webp({ quality: 80 })
					.toBuffer();
				logger.info("Image optimized successfully");
			} catch (error) {
				logger.error("Sharp optimization failed, using original file", error);
				// Fallback to original buffer if sharp fails
			}
		}

		// custom public_id with extension for raw files
		let customPublicId: string | undefined;
		if (resourceType === "raw" && file.originalname) {
			const ext = file.originalname.split(".").pop()?.toLowerCase();
			const baseName = file.originalname
				.replace(/\.[^/.]+$/, "")
				.replace(/[^a-zA-Z0-9]/g, "_");
			const uniqueSuffix = Math.random().toString(36).substring(2, 8);
			customPublicId = `${baseName}_${uniqueSuffix}.${ext}`;
		}

		const result = await this._mediaStorageService.uploadFile(fileBuffer, {
			resourceType: resourceType as "image" | "video" | "raw" | "auto",
			publicId: customPublicId,
		});

		// Override original_filename with actual file name
		return {
			...result,
			original_filename: file.originalname,
		};
	}
}
