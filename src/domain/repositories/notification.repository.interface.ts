import type {
	Notification,
	NotificationEvent,
	NotificationType,
} from "../entities/notification.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface NotificationQuery {
	userId?: string;
	type?: NotificationType | NotificationType[];
	event?: NotificationEvent | NotificationEvent[];
	isRead?: boolean;
	actorId?: string;
}

export interface INotificationRepository
	extends CreatableRepository<Notification>,
		FindByIdRepository<Notification>,
		QueryableRepository<Notification, NotificationQuery>,
		PaginatableRepository<Notification, NotificationQuery>,
		UpdatableByIdRepository<Notification> {}
