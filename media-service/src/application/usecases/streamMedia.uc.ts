import { Readable } from "node:stream";
import type { IMediaStorageService } from "../../domain/services/mediaStorage.service.interface";
import type { IStreamMediaUC } from "../../domain/useCases/streamMedia.uc.interface";
import type { StreamMediaDto, StreamMediaResult } from "../dtos/media.dto";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import logger from "../../common/utils/logger";

export class StreamMediaUC implements IStreamMediaUC {
	constructor(private _mediaStorageService: IMediaStorageService) {}

	async execute(streamDetails: StreamMediaDto): Promise<StreamMediaResult> {
		const { publicId, mediaType } = streamDetails;
		const expiresAt = Math.floor(Date.now() / 1000) + 60;

		let signedUrl = this._mediaStorageService.generateSignedUrl(
			publicId,
			mediaType,
			expiresAt,
			false,
		);

		logger.info(
			`Attempting to fetch media: publicId=${publicId}, mediaType=${mediaType}`,
		);

		let response = await fetch(signedUrl);

		// Fallback to authenticated type for old files
		if (!response.ok) {
			logger.info(
				`First attempt failed with ${response.status}, trying with authenticated type`,
			);
			signedUrl = this._mediaStorageService.generateSignedUrl(
				publicId,
				mediaType,
				expiresAt,
				true,
			);
			response = await fetch(signedUrl);
		}

		if (!response.ok || !response.body) {
			logger.error(
				`Failed to fetch media: publicId=${publicId}, status=${response.status}`,
			);
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_MEDIA,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		return {
			stream: Readable.fromWeb(response.body),
			contentType:
				response.headers.get("content-type") || "application/octet-stream",
		};
	}
}
