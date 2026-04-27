import type { Queue } from "bullmq";
import { inject, injectable } from "inversify";
import type {
	JobMap,
	JobQueuePort,
} from "../../application/ports/job-queue.port";
import { TYPES } from "../../shared/types/types";

@injectable()
export class JobQueueAdapter implements JobQueuePort {
	constructor(
		@inject(TYPES.Queues.NotificationQueue)
		private readonly _notificationQueue: Queue,
	) {}

	async enqueue<K extends keyof JobMap>(
		job: K,
		payload: JobMap[K],
		opts?: { delay?: number; jobId?: string },
	): Promise<void> {
		await this._notificationQueue.add(job, payload, {
			delay: opts?.delay,
			jobId: opts?.jobId,
		});
	}
}
