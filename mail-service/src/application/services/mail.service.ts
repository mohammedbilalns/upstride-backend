import type { Transporter } from "nodemailer";
import type { IMailService } from "../../domain/services/mail.service.interface";
import { createTransporter } from "../../infrastructure/config/nodeMailerConfig";
import { MailType } from "../../common/enums/mailTypes";
import { buildOtpEmailHtml } from "../utils/generateOTPMail";
import { OtpType } from "../../common/enums/otpTypes";
import { buildMentorApprovalEmailHtml } from "../utils/generateMentorOTPMail";
import { SendMailDTO } from "../dtos/sendMail.dto";
import { AppError } from "../errors/AppError";
import { ErrorMessage } from "../../common/enums/errorMessages";

export class MailService implements IMailService {
	private transporter: Transporter;
	constructor() {
		this.transporter = createTransporter();
	}

	/**
	 * Builds the HTML content for an email based on the mail type.
	 *
	 * - Selects the appropriate email template using `mailType`
	 * - Validates that all required data is present
	 */
	private buildEmailContent(mailDetails: SendMailDTO): string {
		switch (mailDetails.mailType) {
			case MailType.REGISTER_OTP:
				if (!mailDetails.otp) throw new AppError(ErrorMessage.OTP_NOT_FOUND);
				return buildOtpEmailHtml(mailDetails.otp, OtpType.register);

			case MailType.PASSWORD_RESET_OTP:
				if (!mailDetails.otp) throw new AppError(ErrorMessage.OTP_NOT_FOUND);
				return buildOtpEmailHtml(mailDetails.otp, OtpType.reset);
				break;

			case MailType.APPROVED_MENTOR:
				if (!mailDetails.userName)
					throw new AppError(ErrorMessage.USERNAME_NOT_FOUND);
				return buildMentorApprovalEmailHtml(mailDetails.userName);
		}
	}

	/**
	 * Sends an email using the configured mail transporter.
	 *
	 * - Delegates email content generation to `buildEmailContent`
	 * - Sends the email via the configured Nodemailer transporter
	 */
	public async sendEmail(mailDetails: SendMailDTO) {
		const html = this.buildEmailContent(mailDetails);

		await this.transporter.sendMail({
			from: "Upstride",
			to: mailDetails.to,
			subject: mailDetails.subject,
			html,
		});
	}
}
