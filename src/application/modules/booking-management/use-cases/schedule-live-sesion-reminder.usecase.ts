import { inject, injectable } from "inversify";
import { TYPES } from "../../../../shared/types/types";
import type { JobQueuePort } from "../../../ports/job-queue.port";
import type { ScheduleLiveSesionReminderInput } from "../dtos/schedule-live-sesion-reminder.dto";
import type { IScheduleLiveSesionReminderUseCase } from "./schedule-mentor-reminder.usecase.interface";

@injectable()
export class ScheduleLiveSesionReminderUseCase
	implements IScheduleLiveSesionReminderUseCase
{
	constructor(
		@inject(TYPES.Services.JobQueue)
		private readonly _jobQueue: JobQueuePort,
	) {}
	async execute(input: ScheduleLiveSesionReminderInput): Promise<void> {
		const oneDayBefore = input.start.getTime() - 24 * 60 * 60 * 1000;
		const oneHourBefore = input.start.getTime() - 60 * 60 * 1000;
		const fiveMinutesBefore = input.start.getTime() - 5 * 60 * 1000;
		const now = Date.now();

		if (oneDayBefore > now) {
			await this._jobQueue.enqueue(
				"send-session-reminder",
				{
					bookingId: input.bookingId,
					mentorId: input.mentorId,
					menteeId: input.menteeId,
					label: "1 day",
				},
				{ delay: oneDayBefore - now },
			);
		}

		if (oneHourBefore > now) {
			await this._jobQueue.enqueue(
				"send-session-reminder",
				{
					bookingId: input.bookingId,
					mentorId: input.mentorId,
					menteeId: input.menteeId,
					label: "1 hour",
				},
				{ delay: oneHourBefore - now },
			);
		}

		if (fiveMinutesBefore > now) {
			await this._jobQueue.enqueue(
				"send-session-reminder",
				{
					bookingId: input.bookingId,
					mentorId: input.mentorId,
					menteeId: input.menteeId,
					label: "5 minutes",
				},
				{ delay: fiveMinutesBefore - now },
			);
		}
	}
}
