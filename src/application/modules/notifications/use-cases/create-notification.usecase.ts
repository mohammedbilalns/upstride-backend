import { inject, injectable } from "inversify";
import { Notification } from "../../../../domain/entities/notification.entity";
import {
	NotificationCreatedEvent,
	type NotificationPayload,
} from "../../../../domain/events/notification-created.event";
import type { INotificationRepository } from "../../../../domain/repositories/notification.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { RealtimeEventBus } from "../../../events/realtime-event-bus.interface";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type {
	CreateNotificationInput,
	CreateNotificationOutput,
} from "../dtos/notification.dto";
import { NotificationMapper } from "../mappers/notification.mapper";
import type { ICreateNotificationUseCase } from "./create-notification.usecase.interface";

@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
	constructor(
		@inject(TYPES.Repositories.NotificationRepository)
		private readonly _notificationRepository: INotificationRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
		@inject(TYPES.Services.RealtimeEventBus)
		private readonly _eventBus: RealtimeEventBus,
	) {}

	async execute(
		input: CreateNotificationInput,
	): Promise<CreateNotificationOutput> {
		const notification = new Notification(
			this._idGenerator.generate(),
			input.userId,
			input.title,
			input.description,
			input.type,
			input.event,
			new Date(),
			false,
			undefined,
			input.metadata,
			input.deliveryStatus,
			input.actorId,
			input.relatedEntityId,
		);

		const created = await this._notificationRepository.create(notification);
		const notificationDto = NotificationMapper.toDto(created);

		const notificationPayload: NotificationPayload = {
			id: notificationDto.id,
			userId: notificationDto.userId,
			title: notificationDto.title,
			description: notificationDto.description,
			type: notificationDto.type,
			event: notificationDto.event,
			isRead: notificationDto.isRead,
			readAt: notificationDto.readAt,
			metadata: notificationDto.metadata,
			deliveryStatus: notificationDto.deliveryStatus,
			actorId: notificationDto.actorId,
			relatedEntityId: notificationDto.relatedEntityId,
			createdAt: notificationDto.createdAt,
			updatedAt: notificationDto.updatedAt,
		};

		await this._eventBus.publish(
			new NotificationCreatedEvent({
				userId: input.userId,
				notification: notificationPayload,
			}),
		);

		return {
			notification: notificationDto,
		};
	}
}
