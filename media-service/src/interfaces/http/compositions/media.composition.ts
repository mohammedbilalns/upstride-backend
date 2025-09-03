import { MediaManagementService } from "../../../application/services/mediaMangement.service";
import { IMediaRepository } from "../../../domain/repositories/media.repository.interface";
import { IMediaMangementService } from "../../../domain/services/mediaMangement.service.interface";
import { MediaRepository } from "../../../infrastructure/database/repositories/media.repository";
import { MediaController } from "../controllers/media.controller";

export function createMediaController() {
  const mediaRepository: IMediaRepository = new MediaRepository();
  const mediaService: IMediaMangementService = new MediaManagementService(
    mediaRepository,
  );
  return new MediaController(mediaService);
}
