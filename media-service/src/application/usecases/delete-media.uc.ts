import type { IMediaStorageService } from "../../domain/services/media-storage.service.interface";
import type { IDeleteMediaUC } from "../../domain/useCases/delete-media.uc.interface";
import type { DeleteMediaDto } from "../dtos/media.dto";
import logger from "../../common/utils/logger";

export class DeleteMediaUC implements IDeleteMediaUC {
	constructor(private _mediaStorageService: IMediaStorageService) {}

	async execute(dto: DeleteMediaDto): Promise<void> {
		const { publicId, resourceType } = dto;
		logger.info(
			`Deleting media: publicId=${publicId}, resourceType=${resourceType}`,
		);
		await this._mediaStorageService.deleteFile(publicId, resourceType);
		logger.info(`Media deleted successfully: ${publicId}`);
	}
}
