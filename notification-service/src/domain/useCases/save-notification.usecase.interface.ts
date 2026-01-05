import { SaveNotificationDto } from "../../application/dtos/notification.dto";

export interface ISaveNotificationUC {
	execute(dto: SaveNotificationDto): Promise<void>;
}
