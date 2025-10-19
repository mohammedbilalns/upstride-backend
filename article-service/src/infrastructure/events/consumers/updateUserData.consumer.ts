import logger from "../../../common/utils/logger";
import type { IAuthorService } from "../../../domain/services/author.service.interface";
import eventBus from "../eventBus";
import { updateUserPayloadSchema } from "../validations/updateUserPayload";

export async function createUpdateUserDataConsumer(
	authorService: IAuthorService,
) {
	await eventBus.subscribe<{
		userId: string;
		name: string;
		profilePicrure: string;
	}>("update.profile", async (payload) => {
		console.log("update profile event consumed");
		console.log("udpate profile payload", JSON.stringify(payload));
		try {
			const { userId, name, profilePicture } =
				updateUserPayloadSchema.parse(payload);
			await authorService.updateAuthor(userId, name, profilePicture);
			logger.info(`Author ${userId} updated`);
		} catch (err) {
			logger.error("Error updating author data", err);
		}
	});
}
