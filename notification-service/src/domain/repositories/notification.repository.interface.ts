import type { FilterQuery } from "mongoose";
import type { Notification } from "../entities/notification.entity";
export interface INotificationRepository {
	create(data: Partial<Notification>): Promise<Notification | null>;
	update(id: string, data: Partial<Notification>): Promise<void>;
	findAll(
		userId: string,
		page: number,
		limit: number,
		filter?: "all" | "unread",
	): Promise<{
		notifications: Notification[];
		total: number;
		unreadCount: number;
	}>;
	findById(id: string): Promise<Notification | null>;
	updateMany(
		filter: FilterQuery<Notification>,
		data: Partial<Notification>,
	): Promise<void>;
}
