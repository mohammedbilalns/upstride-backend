import { MarkNotificationAsReadDto } from "../../application/dtos/notification.dto";

export interface IMarkNotificationAsReadUC {
	execute(dto: MarkNotificationAsReadDto): Promise<void>;
}
