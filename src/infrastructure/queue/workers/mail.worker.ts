import { Worker } from "bullmq";
import type { Redis } from "ioredis";
import type { JobMap } from "../../../application/ports/job-queue.port";
import type { IMailService, MailMessage } from "../../../application/services";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import logger from "../../../shared/logging/logger";
import {
	ChangePasswordOtpMailTemplate,
	MentorApprovalMailTemplate,
	RegisterOtpMailTemplate,
	ResetPasswordMailTemplate,
} from "../../mail/templates";

// Let's create a minimal template directly here for brevity, or we could add it to templates
class SessionReminderMailTemplate {
	subject = "Upcoming Session Reminder";
	render(data: { label: string; otherName: string; link: string }) {
		return {
			html: `<p>You have a session starting in ${data.label} with ${data.otherName}.</p><p>Join here: <a href="${data.link}">${data.link}</a></p>`,
			text: `You have a session starting in ${data.label} with ${data.otherName}. Join here: ${data.link}`,
		};
	}
}

export const createMailWorker = (
	connection: Redis,
	mailService: IMailService,
	userRepository: IUserRepository,
): Worker => {
	const worker = new Worker(
		"mailQueue",
		async (job) => {
			logger.info(`Processing mail job ${job.id} `);
			if (job.name === "send-session-reminder") {
				const data = job.data as JobMap["send-session-reminder"];
				const mentee = await userRepository.findById(data.menteeId);
				const mentor = await userRepository.findById(data.mentorId);
				if (mentee?.email && mentor) {
					const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/call/${data.bookingId}`;
					const template = new SessionReminderMailTemplate();
					const menteeMsg = template.render({
						label: data.label,
						otherName: mentor.name,
						link,
					});
					const mentorMsg = template.render({
						label: data.label,
						otherName: mentee.name,
						link,
					});

					await mailService.send({
						to: mentee.email,
						subject: template.subject,
						html: menteeMsg.html,
						text: menteeMsg.text,
					});
					await mailService.send({
						to: mentor.email,
						subject: template.subject,
						html: mentorMsg.html,
						text: mentorMsg.text,
					});
				}
				return;
			}

			const message = buildMailMessage(
				job.name as keyof JobMap,
				job.data as JobMap[keyof JobMap],
			);
			await mailService.send(message);
		},
		{ connection, concurrency: 5 },
	);

	worker.on("failed", (job, err) => {
		logger.error(`Mail job ${job?.id} failed: ${err.message} `);
	});

	return worker;
};

const buildMailMessage = (
	jobName: keyof JobMap,
	payload: JobMap[keyof JobMap],
): MailMessage => {
	switch (jobName) {
		case "send-register-otp-email": {
			const data = payload as JobMap["send-register-otp-email"];
			const template = new RegisterOtpMailTemplate();
			const { html, text } = template.render({
				name: data.name,
				otp: data.otp,
			});
			return { to: data.to, subject: template.subject, html, text };
		}
		case "send-reset-password-otp-email": {
			const data = payload as JobMap["send-reset-password-otp-email"];
			const template = new ResetPasswordMailTemplate();
			const { html, text } = template.render({ code: data.otp });
			return { to: data.to, subject: template.subject, html, text };
		}
		case "send-change-password-otp-email": {
			const data = payload as JobMap["send-change-password-otp-email"];
			const template = new ChangePasswordOtpMailTemplate();
			const { html, text } = template.render({
				name: data.name,
				otp: data.otp,
			});
			return { to: data.to, subject: template.subject, html, text };
		}
		case "send-mentor-approval-email": {
			const data = payload as JobMap["send-mentor-approval-email"];
			const template = new MentorApprovalMailTemplate();
			const { html, text } = template.render({ name: data.name });
			return { to: data.to, subject: template.subject, html, text };
		}
		default:
			throw new Error(`Unknown mail job: ${jobName}`);
	}
};
