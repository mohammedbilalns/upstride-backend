import { MailRenderer } from "../mail-renderer";
import type { IMailTemplate } from "./mail.template";

export class MentorApprovalMailTemplate implements IMailTemplate {
	readonly purpose = "MENTOR_APPROVAL";
	readonly subject = "Congratulations! Your Mentor Application is Approved";

	render(data: { name: string }) {
		return {
			html: MailRenderer.render("mentor-approval", data),
			text: `Hello ${data.name}, Congratulations! Your application to become a mentor on UpStride has been approved.`,
		};
	}
}
