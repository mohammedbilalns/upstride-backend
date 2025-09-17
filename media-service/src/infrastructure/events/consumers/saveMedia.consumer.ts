import { IMediaMangementService } from "../../../domain/services/mediaMangement.service.interface";
import logger from "../../../common/utils/logger";
import eventBus from "../eventBus";
import { mediaPayloadSchema } from "../validations/mediaPayload";

export async function createSaveMediaConsumer(
  mediaManagementService: IMediaMangementService,
) {
  await eventBus.subscribe("save.media", async (payload) => {
    try {
      const data = mediaPayloadSchema.parse(payload);
      await mediaManagementService.saveMedia(data);
    } catch (err) {
      logger.error("Error while saving media", err);
    }
  });
}
