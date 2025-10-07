import logger from "../../../common/utils/logger";
import type { IMailService } from "../../../domain/services/mail.service.interface";
import eventBus from "../eventBus";
import { mailPayloadSchema } from "../validations/mailPayload";

export async function createSendOtpConsumer(mailService: IMailService) {
	await eventBus.subscribe<{ to: string; subject: string; text: string }>(
		"send.mail",
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
