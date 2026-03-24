import type { Notification } from "../../../../domain/entities/notification.entity";
import type { NotificationDto } from "../dtos/notification.dto";

export class NotificationMapper {
	static toDto(entity: Notification): NotificationDto {
		return {
			id: entity.id,
			userId: entity.userId,
			title: entity.title,
			description: entity.description,
			type: entity.type,
			event: entity.event,
			isRead: entity.isRead,
			readAt: entity.readAt,
			metadata: entity.metadata,
			deliveryStatus: entity.deliveryStatus
				? {
						inApp: entity.deliveryStatus.inApp,
						push: entity.deliveryStatus.push,
						email: entity.deliveryStatus.email,
					}
				: undefined,
			actorId: entity.actorId,
			relatedEntityId: entity.relatedEntityId,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toDtos(entities: Notification[]): NotificationDto[] {
		return entities.map((entity) => NotificationMapper.toDto(entity));
	}
}
