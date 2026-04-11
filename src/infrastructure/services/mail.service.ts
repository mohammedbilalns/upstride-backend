import { injectable } from "inversify";
import type { IMailService, MailMessage } from "../../application/services";
import env from "../../shared/config/env";
import logger from "../../shared/logging/logger";
import { mailTransporter } from "../mail/nodemailer.transport";

@injectable()
export class MailService implements IMailService {
	async send(message: MailMessage): Promise<void> {
		const { to, subject, html, text } = message;

		try {
			await mailTransporter.sendMail({
				from: env.SMTP_USER,
				to,
				subject,
				html,
				text,
			});
			logger.info(`Mail sent successfully to ${to} `);
		} catch (error) {
			logger.error(`Failed to send mail to ${to}: ${error} `);
			throw error;
		}
	}
}
