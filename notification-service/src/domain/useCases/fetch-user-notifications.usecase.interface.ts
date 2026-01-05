import {
	FetchUserNotificationsDto,
	NotificationResponse,
} from "../../application/dtos/notification.dto";

export interface IFetchUserNotificationsUC {
	execute(dto: FetchUserNotificationsDto): Promise<NotificationResponse>;
}
