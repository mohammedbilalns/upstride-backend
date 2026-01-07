import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { IMarkChatNotificationsAsReadUC } from "../../domain/useCases/mark-chat-notifications-as-read.usecase.interface";

export class MarkChatNotificationsAsReadUC
	implements IMarkChatNotificationsAsReadUC
{
	constructor(private _notificationRepository: INotificationRepository) {}

	async execute(userId: string, chatId: string): Promise<void> {
		const filter = {
			userId: userId,
			type: "chat",
			isRead: false,
			link: { $regex: chatId },
		};

		await this._notificationRepository.updateMany(filter, { isRead: true });
	}
}
