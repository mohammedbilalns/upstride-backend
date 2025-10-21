import { QueueEvents } from "../../../common/enums/queueEvents";
import logger from "../../../common/utils/logger";
import type { IMailService } from "../../../domain/services/mail.service.interface";
import eventBus from "../eventBus";
import { mailPayloadSchema } from "../validations/mailPayload";

export async function createSendOtpConsumer(mailService: IMailService) {
	await eventBus.subscribe<{ to: string; subject: string; text: string }>(
		QueueEvents.SEND_OTP,
		async (payload) => {
			try {
				const { to, subject, text } = mailPayloadSchema.parse(payload);
				await mailService.sendEmail(to, subject, text);
				logger.info(`Email sent to ${to} with subject: ${subject}`);
			} catch (err) {
				logger.error("Error sending email:", err);
			}
		},
	);
}
