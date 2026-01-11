import logger from "../../../common/utils/logger";
import type { SaveMediaDto } from "../../../application/dtos/media.dto";
import type { IMediaRepository } from "../../../domain/repositories/media.repository.interface";
import eventBus from "../eventBus";
import { mediaPayloadSchema } from "../validations/mediaPayload";

export async function createSaveMediaConsumer(
	mediaRepository: IMediaRepository,
) {
	await eventBus.subscribe("save.media", async (payload) => {
		try {
			const data = mediaPayloadSchema.parse(payload) as SaveMediaDto;
			await mediaRepository.create({
				mediaType: data.resource_type,
				category: data.category,
				publicId: data.public_id,
				originalName: data.original_filename,
				url: data.secure_url,
				size: data.bytes,
				articleId: data.articleId,
				chatMessageId: data.chatMessageId,
				mentorId: data.mentorId,
				userId: data.userId,
			});
			logger.info(`Media saved: ${data.public_id}`);
		} catch (err) {
			logger.error("Error while saving media", err);
		}
	});
}
