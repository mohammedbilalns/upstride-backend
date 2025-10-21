import {
	DEFAULT_NOTIFICATION_VALUES,
	NOTIFICATION_TEMPLATES,
} from "../../common/constants";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import { QueueEvents } from "../../common/enums/queueEvents";
import type { NotificationType } from "../../common/types/notification.type";
import { IEventBus } from "../../domain/events/IEventBus";
import type { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import type { INotificationService } from "../../domain/services/notification.service.interface";
import type {
	GenerateNotificationDto,
	NotificationDto,
	NotificationResponseDto,
} from "../dtos/notification.dto";
import { AppError } from "../errors/AppError";

export class NotificationService implements INotificationService {
	constructor(private _notificationRepository: INotificationRepository,private _eventBus: IEventBus  ) {}

	private _generateNotificationData(triggerInfo: GenerateNotificationDto): {
		title: string;
		content: string;
		link?: string;
		type: NotificationType;
	} {
		const template = NOTIFICATION_TEMPLATES[triggerInfo.type];

		if (!template) {
			return {
				title: DEFAULT_NOTIFICATION_VALUES.title,
				content: DEFAULT_NOTIFICATION_VALUES.content,
				type: DEFAULT_NOTIFICATION_VALUES.type,
			};
		}

		const title = template.getTitle(triggerInfo);
		const content = template.getContent(triggerInfo);
		const link = template.getLink ? template.getLink(triggerInfo) : undefined;

		return { title, content, link, type: template.type };
	}

	async saveNotification(notificationData: NotificationDto): Promise<void> {
		const { userId, ...triggerInfo } = notificationData;
		const { title, content, link, type } =
			this._generateNotificationData(triggerInfo);


		const newNotification = await this._notificationRepository.create({
			userId,
			title,
			content,
			link,
			type,
		});
		if(!newNotification) return;
		this._eventBus.publish(QueueEvents.NOTIFICATION_CREATED, {id:newNotification.id  , userId, title, content, link, type, createdAt:newNotification.createdAt})
	}

	async markNotificationAsRead(notificationId: string): Promise<void> {
		const notification =
			await this._notificationRepository.findById(notificationId);
		if (!notification)
			throw new AppError(ErrorMessage.INVALID_REQUEST, HttpStatus.BAD_REQUEST);

		await this._notificationRepository.update(notificationId, { isRead: true });
	}

	async fetchUserNotifications(
		userId: string,
		page: number,
		limit: number,
	): Promise<NotificationResponseDto> {
		const { notifications, total, unreadCount } = await this._notificationRepository.findAll(
			userId,
			Number(page),
			Number(limit),
		);
		return { notifications, total, unreadCount };
	}

	async makrAllNotificationsAsRead(userId: string): Promise<void> {
		await this._notificationRepository.updateMany(
			{ userId },
			{ isRead: true },
		);
	}
}
