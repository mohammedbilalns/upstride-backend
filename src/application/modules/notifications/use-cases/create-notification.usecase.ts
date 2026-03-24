import { inject, injectable } from "inversify";
import { Notification } from "../../../../domain/entities/notification.entity";
import { NotificationCreatedEvent } from "../../../../domain/events/notification-created.event";
import type { INotificationRepository } from "../../../../domain/repositories/notification.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
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
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
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

		// Publish  event for background processing
		await this._eventBus.publish(
			new NotificationCreatedEvent(input.userId, notificationDto),
		);

		return {
			notification: notificationDto,
		};
	}
}
