export interface NotificationPort {
	emitToUser(userId: string, event: string, payload: unknown): void;
}
