import type { IMailTemplate } from "./mail.template";

export class RegisterOtpMailTemplate implements IMailTemplate {
	readonly purpose = "REGISTER";
	readonly subject = "Verify your account";

	render(data: { name: string; otp: string }) {
		return {
			html: `
        <h1>Hello ${data.name}</h1>
        <p>Your OTP is <strong>${data.otp}</strong></p>
      `,
			text: `Hello ${data.name}, Your OTP is ${data.otp}`,
		};
	}
}
