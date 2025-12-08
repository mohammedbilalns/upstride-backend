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
	 * Sends an email based on the provided DTO.
	 * The DTO determines the email type and required data (OTP / username).
	 */
	public async sendEmail(dto: SendMailDTO) {
		let text: string;

		// Select email template based on `mailType` and validate required data
		switch (dto.mailType) {
			case MailType.REGISTER_OTP:
				if (!dto.otp) throw new AppError(ErrorMessage.OTP_NOT_FOUND);
				text = buildOtpEmailHtml(dto.otp, OtpType.register);
				break;

			case MailType.PASSWORD_RESET_OTP:
				if (!dto.otp) throw new AppError(ErrorMessage.OTP_NOT_FOUND);
				text = buildOtpEmailHtml(dto.otp, OtpType.reset);
				break;

			case MailType.APPROVED_MENTOR:
				if (!dto.userName) throw new AppError(ErrorMessage.USERNAME_NOT_FOUND);
				text = buildMentorApprovalEmailHtml(dto.userName);
				break;
		}

		await this.transporter.sendMail({
			from: "Upstride",
			to: dto.to,
			subject: dto.subject,
			html: text,
		});
	}
}
