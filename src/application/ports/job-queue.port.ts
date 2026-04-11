export type JobMap = {
	"send-register-otp-email": { to: string; name: string; otp: string };
	"send-reset-password-otp-email": { to: string; otp: string };
	"send-change-password-otp-email": { to: string; name: string; otp: string };
	"send-mentor-approval-email": { to: string; name: string };
};

export interface JobQueuePort {
	enqueue<K extends keyof JobMap>(job: K, payload: JobMap[K]): Promise<void>;
}
