import { inject, injectable } from "inversify";
import type { JobMap } from "../../../application/ports/job-queue.port";
import type { IMailService } from "../../../application/services";
import { TYPES } from "../../../shared/types/types";
import {
	ChangePasswordOtpMailTemplate,
	MentorApprovalMailTemplate,
	RegisterOtpMailTemplate,
	RescheduleBookingMailTemplate,
	ResetPasswordMailTemplate,
} from "../../mail/templates";
import type { IJobHandler } from "./notification.worker.interface";

@injectable()
export class RegisterOtpHandler
	implements IJobHandler<"send-register-otp-email">
{
	constructor(
		@inject(TYPES.Services.MailService)
		private readonly _mailService: IMailService,
	) {}

	async handle(data: JobMap["send-register-otp-email"]): Promise<void> {
		const template = new RegisterOtpMailTemplate();
		const { html, text } = template.render({ name: data.name, otp: data.otp });
		await this._mailService.send({
			to: data.to,
			subject: template.subject,
			html,
			text,
		});
	}
}

@injectable()
export class ResetPasswordOtpHandler
	implements IJobHandler<"send-reset-password-otp-email">
{
	constructor(
		@inject(TYPES.Services.MailService)
		private readonly _mailService: IMailService,
	) {}

	async handle(data: JobMap["send-reset-password-otp-email"]) {
		const template = new ResetPasswordMailTemplate();
		const { html, text } = template.render({ code: data.otp });
		await this._mailService.send({
			to: data.to,
			subject: template.subject,
			html,
			text,
		});
	}
}

@injectable()
export class ChangePasswordOtpHandler
	implements IJobHandler<"send-change-password-otp-email">
{
	constructor(
		@inject(TYPES.Services.MailService)
		private readonly _mailService: IMailService,
	) {}

	async handle(data: JobMap["send-change-password-otp-email"]) {
		const template = new ChangePasswordOtpMailTemplate();
		const { html, text } = template.render({ name: data.name, otp: data.otp });
		await this._mailService.send({
			to: data.to,
			subject: template.subject,
			html,
			text,
		});
	}
}

@injectable()
export class MentorApprovalHandler
	implements IJobHandler<"send-mentor-approval-email">
{
	constructor(
		@inject(TYPES.Services.MailService)
		private readonly _mailService: IMailService,
	) {}

	async handle(data: JobMap["send-mentor-approval-email"]) {
		const template = new MentorApprovalMailTemplate();
		const { html, text } = template.render({ name: data.name });
		await this._mailService.send({
			to: data.to,
			subject: template.subject,
			html,
			text,
		});
	}
}

@injectable()
export class RescheduleBookingHandler
	implements IJobHandler<"send-reschedule-booking-email">
{
	constructor(
		@inject(TYPES.Services.MailService)
		private readonly _mailService: IMailService,
	) {}

	async handle(data: JobMap["send-reschedule-booking-email"]) {
		const template = new RescheduleBookingMailTemplate();
		const { html, text } = template.render({
			mentorName: data.mentorName,
			menteeName: data.menteeName,
			oldStartTime: data.oldStartTime,
			newStartTime: data.newStartTime,
			newEndTime: data.newEndTime,
		});
		await this._mailService.send({
			to: data.to,
			subject: template.subject,
			html,
			text,
		});
	}
}
