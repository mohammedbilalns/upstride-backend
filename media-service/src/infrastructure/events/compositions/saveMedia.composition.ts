import { MediaRepository } from "../../database/repositories/media.repository";
import { createSaveMediaConsumer } from "../consumers/saveMedia.consumer";

export async function composeSaveMediaConsumer() {
	const mediaRepository = new MediaRepository();
	await createSaveMediaConsumer(mediaRepository);
}
