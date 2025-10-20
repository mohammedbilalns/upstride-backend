import { ErrorMessage, HttpStatus } from "../../common/enums";
import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { INotificationService } from "../../domain/services/notification.service.interface";
import { NotificationResponseDto } from "../dtos/notification.dto";
import { AppError } from "../errors/AppError";

export class NotificationService implements INotificationService{
	constructor(private _notificationRepository: INotificationRepository){}

	async saveNotification(data: any): Promise<void> {

		await this._notificationRepository.create(data);
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
