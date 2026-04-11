import { MailRenderer } from "../mail-renderer";
import type { IMailTemplate } from "./mail.template";

export class ChangePasswordOtpMailTemplate implements IMailTemplate {
	readonly purpose = "CHANGE_PASSWORD";
	readonly subject = "Change your password";

	render(data: { name: string; otp: string }) {
		return {
			html: MailRenderer.render("change-password-otp", data),
			text: `Hello ${data.name}, Your OTP for UpStride password change is ${data.otp}`,
		};
	}
}
