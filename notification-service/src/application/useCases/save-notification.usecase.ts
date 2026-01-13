import { QueueEvents } from "../../common/enums/queue-events";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { INotificationGenerator } from "../../domain/services/notification-generator.service.interface";
import { ISaveNotificationUC } from "../../domain/useCases/save-notification.usecase.interface";
import { SaveNotificationDto } from "../dtos/notification.dto";

export class SaveNotificationUC implements ISaveNotificationUC {
	constructor(
		private _notificationRepository: INotificationRepository,
		private _notificationGeneratorService: INotificationGenerator,
		private _eventBus: IEventBus,
	) {}

	async execute(notificationData: SaveNotificationDto): Promise<void> {
		const triggerInfo = {
			type: notificationData.type,
			triggeredBy: notificationData.triggeredBy,
			targetResource: notificationData.targetResource,
			time: notificationData.time,
		};
		const { title, content, link, type } =
			this._notificationGeneratorService.generate(triggerInfo);

		const newNotification = await this._notificationRepository.create({
			userId: notificationData.userId,
			title,
			content,
			link,
			type,
		});

		if (!newNotification) return;

		this._eventBus.publish(QueueEvents.NOTIFICATION_CREATED, {
			id: newNotification.id,
			userId: notificationData.userId,
			title,
			content,
			link,
			type,
			createdAt: newNotification.createdAt,
		});
	}
}
