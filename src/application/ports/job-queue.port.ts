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
};

export interface JobQueuePort {
	enqueue<K extends keyof JobMap>(
		job: K,
		payload: JobMap[K],
		opts?: { delay?: number },
	): Promise<void>;
}
