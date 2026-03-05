import type { Queue } from "bullmq";
import { inject, injectable } from "inversify";
import type { IMailService } from "../../application/services/mail.service.interface";
import type { IMailTemplate } from "../../domain/mail";
import { TYPES } from "../../shared/types/types";

@injectable()
export class MailService implements IMailService {
	constructor(
		@inject(TYPES.Queues.MailQueue) private readonly mailQueue: Queue,
	) {}

	async send(
		to: string,
		template: IMailTemplate,
		data: unknown,
	): Promise<void> {
		const { html, text } = template.render(data);

		await this.mailQueue.add("send_mail", {
			to,
			subject: template.subject,
			html,
			text,
		});
	}
}
