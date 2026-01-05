import { MarkAllNotificationsAsReadDto } from "../../application/dtos/notification.dto";

export interface IMarkAllNotificationsAsReadUC {
	execute(dto: MarkAllNotificationsAsReadDto): Promise<void>;
}
