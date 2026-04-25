import type { Queue } from "bullmq";
import { inject, injectable } from "inversify";
import type { BookingJobQueuePort } from "../../application/ports/booking-job-queue.port";
import { TYPES } from "../../shared/types/types";

@injectable()
export class BookingJobQueueAdapter implements BookingJobQueuePort {
	constructor(
		@inject(TYPES.Queues.BookingSettlementQueue)
		private readonly _bookingQueue: Queue,
	) {}

	async enqueue(
		job: "settle-ended-session",
		payload: { bookingId: string },
		opts?: { delay?: number; jobId?: string },
	): Promise<void> {
		await this._bookingQueue.add(job, payload, {
			delay: opts?.delay,
			jobId: opts?.jobId,
		});
	}
}
