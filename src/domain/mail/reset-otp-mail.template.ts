import type { IMailTemplate } from "./mail.template";

export class ResetPasswordMailTemplate implements IMailTemplate {
	readonly purpose = "RESET_PASSWORD";
	readonly subject = "Reset your password";

	render(data: { code: string }) {
		return {
			html: `
        <h1>Password Reset</h1>
        <p>Your OTP for password reset is: <strong>${data.code}</strong></p>
      `,
			text: `Your OTP for password reset is: ${data.code}`,
		};
	}
}
