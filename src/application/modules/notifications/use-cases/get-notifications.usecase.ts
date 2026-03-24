import { inject, injectable } from "inversify";
import type {
	INotificationRepository,
	NotificationQuery,
} from "../../../../domain/repositories/notification.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetNotificationsInput,
	GetNotificationsOutput,
} from "../dtos/notification.dto";
import { NotificationMapper } from "../mappers/notification.mapper";
import type { IGetNotificationsUseCase } from "./get-notifications.usecase.interface";

const NOTIFICATIONS_PAGE_SIZE = 10;

@injectable()
export class GetNotificationsUseCase implements IGetNotificationsUseCase {
	constructor(
		@inject(TYPES.Repositories.NotificationRepository)
		private readonly _notificationRepository: INotificationRepository,
	) {}

	async execute(input: GetNotificationsInput): Promise<GetNotificationsOutput> {
		const query: NotificationQuery = {
			userId: input.userId,
			isRead:
				input.status === "read"
					? true
					: input.status === "unread"
						? false
						: undefined,
		};

		const result = await this._notificationRepository.paginate({
			page: input.page ?? 1,
			limit: NOTIFICATIONS_PAGE_SIZE,
			query,
			sort: { createdAt: -1 },
		});

		return {
			notifications: NotificationMapper.toDtos(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
