import { MailRenderer } from "../../infrastructure/mail/mail-renderer";
import type { IMailTemplate } from "./mail.template";

export class RegisterOtpMailTemplate implements IMailTemplate {
	readonly purpose = "REGISTER";
	readonly subject = "Verify your account";

	render(data: { name: string; otp: string }) {
		return {
			html: MailRenderer.render("register-otp", data),
			text: `Hello ${data.name}, Your OTP for UpStride is ${data.otp}`,
		};
	}
}
