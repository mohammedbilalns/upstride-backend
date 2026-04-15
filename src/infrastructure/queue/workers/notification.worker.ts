import { Worker } from "bullmq";
import type { Redis } from "ioredis";
import type { JobMap } from "../../../application/ports/job-queue.port";
import type {
	IMailService,
	IPushNotificationPort,
	MailMessage,
} from "../../../application/services";
import type { IPushSubscriptionRepository } from "../../../domain/repositories/push-subscription.repository.interface";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import logger from "../../../shared/logging/logger";
import {
	ChangePasswordOtpMailTemplate,
	MentorApprovalMailTemplate,
	RegisterOtpMailTemplate,
	ResetPasswordMailTemplate,
} from "../../mail/templates";

class SessionReminderMailTemplate {
	subject = "Upcoming Session Reminder";
	render(data: { label: string; otherName: string; link: string }) {
		return {
			html: `<p>You have a session starting in ${data.label} with ${data.otherName}.</p><p>Join here: <a href="${data.link}">${data.link}</a></p>`,
			text: `You have a session starting in ${data.label} with ${data.otherName}. Join here: ${data.link}`,
		};
	}
}

export const createNotificationWorker = (
	connection: Redis,
	mailService: IMailService,
	userRepository: IUserRepository,
	pushNotificationPort: IPushNotificationPort,
	pushSubscriptionRepository: IPushSubscriptionRepository,
): Worker => {
	const worker = new Worker(
		"notificationQueue",
		async (job) => {
			logger.info(`Processing notification job ${job.id} `);
			if (job.name === "send-session-reminder") {
				const data = job.data as JobMap["send-session-reminder"];
				const mentee = await userRepository.findById(data.menteeId);
				const mentor = await userRepository.findById(data.mentorId);
				if (mentee?.email && mentor) {
					const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/call/${data.bookingId}`;
					const template = new SessionReminderMailTemplate();

					if (data.label === "1 day") {
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
					} else {
						// Send push notifications for 1 hour and 5 minutes
						const sendPush = async (
							userId: string,
							otherName: string,
							role: string,
						) => {
							logger.info(
								`[NotificationWorker] Sending ${data.label} push to ${role} (${userId})`,
							);
							const subscriptions =
								await pushSubscriptionRepository.findByUserId(userId);

							logger.info(
								`[NotificationWorker] Found ${subscriptions.length} subscriptions for ${role} (${userId})`,
							);

							const payload = JSON.stringify({
								title: "Upcoming Session",
								body: `Your session with ${otherName} starts in ${data.label}.`,
								link,
							});

							for (const sub of subscriptions) {
								try {
									logger.info(
										`[NotificationWorker] Attempting push to endpoint: ${sub.endpoint.substring(0, 30)}...`,
									);
									await pushNotificationPort.sendNotification(
										{ endpoint: sub.endpoint, keys: sub.keys },
										payload,
									);
									logger.info(
										`[NotificationWorker] Push delivered successfully to ${sub.endpoint.substring(0, 30)}...`,
									);
								} catch (error: any) {
									logger.error(
										`[NotificationWorker] Push failed for ${role}: ${error.message}`,
									);
									if (error.message === "SUBSCRIPTION_EXPIRED") {
										logger.info(
											`[NotificationWorker] Deleting expired subscription for ${userId}`,
										);
										await pushSubscriptionRepository.deleteByEndpoint(
											sub.endpoint,
										);
									}
								}
							}
						};

						await sendPush(data.menteeId, mentor.name, "Mentee");
						await sendPush(data.mentorId, mentee.name, "Mentor");
					}
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
		logger.error(`Notification job ${job?.id} failed: ${err.message} `);
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
			throw new Error(`Unknown notification job: ${jobName}`);
	}
};
