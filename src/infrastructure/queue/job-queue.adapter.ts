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
		@inject(TYPES.Queues.MailQueue) private readonly _mailQueue: Queue,
	) {}

	async enqueue<K extends keyof JobMap>(
		job: K,
		payload: JobMap[K],
		opts?: { delay?: number },
	): Promise<void> {
		await this._mailQueue.add(job, payload, { delay: opts?.delay });
	}
}
