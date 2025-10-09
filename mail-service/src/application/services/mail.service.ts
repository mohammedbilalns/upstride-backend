import type { Transporter } from "nodemailer";
import type { IMailService } from "../../domain/services/mail.service.interface";
import { createTransporter } from "../../infrastructure/config/nodeMailerConfig";

export class MailService implements IMailService {
	private transporter: Transporter;
	constructor() {
		this.transporter = createTransporter();
	}

	async sendEmail(to: string, subject: string, text: string) {
		await this.transporter.sendMail({
			from: "Skillsphere",
			to,
			subject,
			html: text || "<h1>Hi</h1>",
		});
	}
}
