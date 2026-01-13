import { QueueEvents } from "../../../common/enums/queue-events";
import logger from "../../../common/utils/logger";
import type { IMailService } from "../../../domain/services/mail.service.interface";
import eventBus from "../eventBus";
import { mailPayloadSchema } from "../validations/mailPayload";

/**
 * Registers a consumer that listens for SEND_EMAIL events
 * and triggers email delivery through the mail service.
 */
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
