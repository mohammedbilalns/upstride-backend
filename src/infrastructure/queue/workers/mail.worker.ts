import { Worker } from "bullmq";
import type { Redis } from "ioredis";
import type { JobMap } from "../../../application/ports/job-queue.port";
import type { IMailService, MailMessage } from "../../../application/services";
import logger from "../../../shared/logging/logger";
import {
	ChangePasswordOtpMailTemplate,
	MentorApprovalMailTemplate,
	RegisterOtpMailTemplate,
	ResetPasswordMailTemplate,
} from "../../mail/templates";

/**
 * Creates and returns the BullMQ worker for the mailQueue.
 *
 * @param connection The Redis connection instance.
 * @returns A BullMQ Worker instance.
 */
export const createMailWorker = (
	connection: Redis,
	mailService: IMailService,
): Worker => {
	const worker = new Worker(
		"mailQueue",
		async (job) => {
			logger.info(`Processing mail job ${job.id} `);
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
