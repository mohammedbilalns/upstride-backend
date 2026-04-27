import { inject, injectable } from "inversify";
import type { JobMap } from "../../../application/ports/job-queue.port";
import type {
	IMailService,
	IPushNotificationPort,
} from "../../../application/services";
import type { PushSubscription } from "../../../domain/entities/push-subscription.entity";
import type { IPushSubscriptionRepository } from "../../../domain/repositories/push-subscription.repository.interface";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import env from "../../../shared/config/env";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import { SessionReminderMailTemplate } from "../../mail/templates";
import type { IJobHandler } from "./notification.worker.interface";

const EMAIL_REMINDER_LABELS: ReadonlyArray<string> = ["1 day"];

@injectable()
export class SessionReminderHandler
	implements IJobHandler<"send-session-reminder">
{
	constructor(
		@inject(TYPES.Services.MailService)
		private readonly _mailService: IMailService,
		@inject(TYPES.Services.PushNotificationPort)
		private readonly _pushNotificationPort: IPushNotificationPort,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Repositories.PushSubscriptionRepository)
		private readonly _pushSubscriptionRepository: IPushSubscriptionRepository,
	) {}

	async handle(data: JobMap["send-session-reminder"]) {
		const [mentee, mentor] = await Promise.all([
			this._userRepository.findById(data.menteeId),
			this._userRepository.findById(data.mentorId),
		]);

		if (!mentee || !mentor) {
			throw new Error(`Users not found for booking ${data.bookingId}`);
		}

		const link = `${env.CLIENT_URL}/call/${data.bookingId}`;

		if (EMAIL_REMINDER_LABELS.includes(data.label)) {
			if (!mentee.email || !mentor.email) {
				throw new Error(`Missing reminder email for booking ${data.bookingId}`);
			}

			await this._sendReminderEmails(
				data,
				{ email: mentee.email, name: mentee.name },
				{ email: mentor.email, name: mentor.name },
				link,
			);
		} else {
			await this._sendReminderPushes(data, mentee, mentor, link);
		}
	}

	private async _sendReminderEmails(
		data: JobMap["send-session-reminder"],
		mentee: { email: string; name: string },
		mentor: { email: string; name: string },
		link: string,
	) {
		const template = new SessionReminderMailTemplate();

		const [menteeMsg, mentorMsg] = [
			template.render({ label: data.label, otherName: mentor.name, link }),
			template.render({ label: data.label, otherName: mentee.name, link }),
		];

		await Promise.all([
			this._mailService.send({
				to: mentee.email,
				subject: template.subject,
				...menteeMsg,
			}),
			this._mailService.send({
				to: mentor.email,
				subject: template.subject,
				...mentorMsg,
			}),
		]);
	}

	private async _sendReminderPushes(
		data: JobMap["send-session-reminder"],
		mentee: { name: string },
		mentor: { name: string },
		link: string,
	) {
		await Promise.all([
			this._sendPushToUser(data.menteeId, mentor.name, data.label, link),
			this._sendPushToUser(data.mentorId, mentee.name, data.label, link),
		]);
	}

	private async _sendPushToUser(
		userId: string,
		otherName: string,
		label: string,
		link: string,
	) {
		const subscriptions =
			await this._pushSubscriptionRepository.findByUserId(userId);
		logger.info(
			`[SessionReminder] ${subscriptions.length} subscriptions for user ${userId}`,
		);

		const payload = JSON.stringify({
			title: "Upcoming Session",
			body: `Your session with ${otherName} starts in ${label}.`,
			link,
		});

		await Promise.all(
			subscriptions.map((sub) => this._deliverPush(sub, payload, userId)),
		);
	}

	private async _deliverPush(
		sub: PushSubscription,
		payload: string,
		userId: string,
	) {
		try {
			await this._pushNotificationPort.sendNotification(
				{ endpoint: sub.endpoint, keys: sub.keys },
				payload,
			);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);

			logger.error(`[SessionReminder] Push failed for ${userId}: ${message}`);
			if (message === "SUBSCRIPTION_EXPIRED") {
				await this._pushSubscriptionRepository.deleteByEndpoint(sub.endpoint);
			}
		}
	}
}
