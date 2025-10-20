import { Notification } from "../entities/notification.entity";
export interface INotificationRepository {
	create(data: Partial<Notification>): Promise<void>;
	update(id: string, data: Partial<Notification>): Promise<void>;
	findAll(userId: string, page: number, limit: number): Promise<{notifications: Notification[], total: number}>;
	findById(id: string): Promise<Notification | null>;
}
