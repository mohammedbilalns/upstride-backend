import { Worker } from "bullmq";
import { inject, injectable } from "inversify";
import type { Redis } from "ioredis";
import type { JobMap } from "../../../application/ports/job-queue.port";
import { QUEUE_NAMES } from "../../../shared/constants";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import type {
	ChangePasswordOtpHandler,
	MentorApprovalHandler,
	RegisterOtpHandler,
	ResetPasswordOtpHandler,
} from "./mail-job.handler";
import type { IJobHandler } from "./notification.worker.interface";
import type { SessionReminderHandler } from "./session-reminder.handler";

type HandlerMap = { [K in keyof JobMap]: IJobHandler<K> };

@injectable()
export class NotificationWorkerFactory {
	private _worker: Worker | null = null;

	constructor(
		@inject(TYPES.Databases.Redis)
		private readonly _connection: Redis,
		@inject(TYPES.Workers.RegisterOtpHandler)
		private readonly _registerOtpHandler: RegisterOtpHandler,
		@inject(TYPES.Workers.ResetPasswordOtpHandler)
		private readonly _resetPasswordOtpHandler: ResetPasswordOtpHandler,
		@inject(TYPES.Workers.ChangePasswordOtpHandler)
		private readonly _changePasswordOtpHandler: ChangePasswordOtpHandler,
		@inject(TYPES.Workers.MentorApprovalHandler)
		private readonly _mentorApprovalHandler: MentorApprovalHandler,
		@inject(TYPES.Workers.SessionReminderHandler)
		private readonly _sessionReminderHandler: SessionReminderHandler,
	) {}

	create(): Worker {
		if (this._worker) {
			return this._worker;
		}

		const handlers: HandlerMap = {
			"send-register-otp-email": this._registerOtpHandler,
			"send-reset-password-otp-email": this._resetPasswordOtpHandler,
			"send-change-password-otp-email": this._changePasswordOtpHandler,
			"send-mentor-approval-email": this._mentorApprovalHandler,
			"send-session-reminder": this._sessionReminderHandler,
		};

		const worker = new Worker(
			QUEUE_NAMES.NOTIFICATION,
			async (job) => {
				logger.info(`Processing notification job ${job.id}`);

				const handler = handlers[job.name as keyof JobMap];
				if (!handler) throw new Error(`No handler for job: ${job.name}`);

				await handler.handle(job.data);
			},
			{ connection: this._connection, concurrency: 5 },
		);

		worker.on("failed", (job, err) => {
			logger.error(`Notification job ${job?.id} failed: ${err.message}`);
		});

		this._worker = worker;
		return this._worker;
	}
}
