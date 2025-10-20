import { NOTIFICATION_TEMPLATES } from "../../common/constants/notificattion-template";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import { NotificationType } from "../../common/types/notification.type";
import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { INotificationService } from "../../domain/services/notification.service.interface";
import { GenerateNotificationDto, NotificationDto, NotificationResponseDto } from "../dtos/notification.dto";
import { AppError } from "../errors/AppError";

export class NotificationService implements INotificationService{
	constructor(private _notificationRepository: INotificationRepository){}

	private _generateNotificationData(
		triggerInfo: GenerateNotificationDto
	): { title: string; content: string; link?: string; type: NotificationType } {

		const template = NOTIFICATION_TEMPLATES[triggerInfo.type];

		if (!template) {
			return {
				title: "New notification",
				content: "You have a new notification",
				type: undefined,
			};
		}

		const title = template.getTitle(triggerInfo);
		const content = template.getContent(triggerInfo);
		const link = template.getLink ? template.getLink(triggerInfo) : undefined;

		return { title, content, link, type: template.type };
	}	

	async saveNotification(notificationData: NotificationDto): Promise<void> {

		const {userId, ...triggerInfo} = notificationData;
		const {title, content, link, type} = this._generateNotificationData(triggerInfo)

		await this._notificationRepository.create({userId, title, content, link, type});
	}

	async markNotificationAsRead(notificationId: string): Promise<void> {

		const notification = await this._notificationRepository.findById(notificationId);
		if (!notification) throw new AppError(ErrorMessage.INVALID_REQUEST, HttpStatus.BAD_REQUEST);

		await this._notificationRepository.update(notificationId, { isRead: true });
	}

	async fetchUserNotifications(userId: string, page: number, limit: number): Promise<NotificationResponseDto> {

		const { notifications, total } = await this._notificationRepository.findAll(userId, Number(page), Number(limit));
		return { notifications, total };
	}

}
