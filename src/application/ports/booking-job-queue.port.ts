export interface BookingJobQueuePort {
	enqueue(
		job: "settle-ended-session",
		payload: { bookingId: string },
		opts?: { delay?: number; jobId?: string },
	): Promise<void>;
}
