import { MailRenderer } from "../mail-renderer";
import type { IMailTemplate } from "./mail.template";

export class ResetPasswordMailTemplate implements IMailTemplate {
	readonly purpose = "RESET_PASSWORD";
	readonly subject = "Reset your password";

	render(data: { code: string }) {
		return {
			html: MailRenderer.render("reset-password-otp", data),
			text: `Your OTP for UpStride password reset is: ${data.code}`,
		};
	}
}
