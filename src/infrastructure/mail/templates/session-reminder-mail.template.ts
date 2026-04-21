import { MailRenderer } from "../mail-renderer";
import type { IMailTemplate } from "./mail.template";

export class SessionReminderMailTemplate implements IMailTemplate {
	readonly purpose = "SESSION_REMINDER";
	readonly subject = "Upcoming Session Reminder";

	render(data: { label: string; otherName: string; link: string }) {
		return {
			html: MailRenderer.render("session-reminder", data),
			text: `You have a session starting in ${data.label} with ${data.otherName}. Join here: ${data.link}`,
		};
	}
}
