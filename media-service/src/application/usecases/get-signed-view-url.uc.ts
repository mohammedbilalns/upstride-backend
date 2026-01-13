import type { IMediaStorageService } from "../../domain/services/media-storage.service.interface";
import type { IGetSignedViewUrlUC } from "../../domain/useCases/get-signed-view-url.uc.interface";
import type { GetSignedViewUrlDto } from "../dtos/media.dto";
import logger from "../../common/utils/logger";

export class GetSignedViewUrlUC implements IGetSignedViewUrlUC {
	constructor(private _mediaStorageService: IMediaStorageService) {}

	execute(dto: GetSignedViewUrlDto): string {
		const { publicId, mediaType } = dto;
		const URL_EXPIRY_IN_SECONDS = 300;
		const expiresAt = Math.floor(Date.now() / 1000) + URL_EXPIRY_IN_SECONDS;

		const signedUrl = this._mediaStorageService.generateSignedUrl(
			publicId,
			mediaType,
			expiresAt,
			false,
		);

		logger.info(`Generated signed view URL for: ${publicId}`);
		return signedUrl;
	}
}
