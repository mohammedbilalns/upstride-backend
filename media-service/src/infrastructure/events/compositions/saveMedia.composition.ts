import { MediaManagementService } from "../../../application/services/mediaMangement.service";
import { MediaRepository } from "../../database/repositories/media.repository";
import { createSaveMediaConsumer } from "../consumers/saveMedia.consumer";

export async function composeSaveMediaConsumer() {
  const mediarepository = new MediaRepository();
  const mediaManagementService = new MediaManagementService(mediarepository);
  await createSaveMediaConsumer(mediaManagementService);
}
