import { ErrorMessage, HttpStatus } from "../../common/enums";
import { INotificationRepository } from "../../domain/repositories/notification.repository.interface";
import { IMarkNotificationAsReadUC } from "../../domain/useCases/mark-notification-as-read.usecase.interface";
import { MarkNotificationAsReadDto } from "../dtos/notification.dto";
import { AppError } from "../errors/AppError";

export class MarkNotificationAsReadUC implements IMarkNotificationAsReadUC {
	constructor(private _notificationRepository: INotificationRepository) {}

	async execute(dto: MarkNotificationAsReadDto): Promise<void> {
		const notification = await this._notificationRepository.findById(
			dto.notificationId,
		);
		if (!notification)
			throw new AppError(ErrorMessage.INVALID_REQUEST, HttpStatus.BAD_REQUEST);

		await this._notificationRepository.update(dto.notificationId, {
			isRead: true,
		});
	}
}
