import { QueueEvents } from "../../../common/enums/queueEvents";
import logger from "../../../common/utils/logger";
import type { IMailService } from "../../../domain/services/mail.service.interface";
import eventBus from "../eventBus";
import { mailPayloadSchema } from "../validations/mailPayload";

export async function createSendOtpConsumer(mailService: IMailService) {
	await eventBus.subscribe<{ to: string; subject: string; text: string }>(
		QueueEvents.SEND_EMAIL,
		async (payload) => {
			try {
				const parsedPayload = mailPayloadSchema.parse(payload);
				await mailService.sendEmail(parsedPayload);
				logger.info(
					`Email sent to ${parsedPayload.to} with subject: ${parsedPayload.subject}`,
				);
			} catch (err) {
				logger.error(`Error sending email: ${err}`);
			}
		},
	);
}
