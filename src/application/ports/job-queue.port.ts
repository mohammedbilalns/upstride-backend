export type JobMap = {
	"send-register-otp-email": { to: string; name: string; otp: string };
	"send-reset-password-otp-email": { to: string; otp: string };
	"send-change-password-otp-email": { to: string; name: string; otp: string };
	"send-mentor-approval-email": { to: string; name: string };
	"send-session-reminder": {
		bookingId: string;
		mentorId: string;
		menteeId: string;
		label: string;
	};
	"send-reschedule-booking-email": {
		to: string;
		mentorName: string;
		menteeName: string;
		oldStartTime: string;
		newStartTime: string;
		newEndTime: string;
	};
};

export interface JobQueuePort {
	enqueue<K extends keyof JobMap>(
		job: K,
		payload: JobMap[K],
		opts?: { delay?: number; jobId?: string },
	): Promise<void>;
}
