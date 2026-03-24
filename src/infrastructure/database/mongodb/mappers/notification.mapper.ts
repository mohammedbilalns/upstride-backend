import { Types } from "mongoose";
import { Notification } from "../../../../domain/entities/notification.entity";
import type { NotificationDocument } from "../models/notification.model";

export class NotificationMapper {
	static toDomain(doc: NotificationDocument): Notification {
		return new Notification(
			doc._id.toString(),
			doc.userId.toString(),
			doc.title,
			doc.description,
			doc.type,
			doc.event,
			doc.createdAt,
			doc.isRead ?? false,
			doc.readAt,
			doc.metadata,
			doc.deliveryStatus
				? {
						inApp: doc.deliveryStatus.inApp,
						push: doc.deliveryStatus.push,
						email: doc.deliveryStatus.email,
					}
				: undefined,
			doc.actorId?.toString(),
			doc.updatedAt,
		);
	}

	static toDocument(entity: Notification): Partial<NotificationDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
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
			actorId: entity.actorId ? new Types.ObjectId(entity.actorId) : undefined,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
