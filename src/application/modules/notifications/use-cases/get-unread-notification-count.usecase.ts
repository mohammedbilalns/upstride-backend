import { inject, injectable } from "inversify";
import type { INotificationRepository } from "../../../../domain/repositories/notification.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetUnreadNotificationCountInput,
	GetUnreadNotificationCountOutput,
} from "../dtos/notification.dto";
import type { IGetUnreadNotificationCountUseCase } from "./get-unread-notification-count.usecase.interface";

@injectable()
export class GetUnreadNotificationCountUseCase
	implements IGetUnreadNotificationCountUseCase
{
	constructor(
		@inject(TYPES.Repositories.NotificationRepository)
		private readonly _notificationRepository: INotificationRepository,
	) {}

	async execute(
		input: GetUnreadNotificationCountInput,
	): Promise<GetUnreadNotificationCountOutput> {
		const count = await this._notificationRepository.countUnread(input.userId);

		return { count };
	}
}
