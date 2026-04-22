import type {
	GetUnreadNotificationCountInput,
	GetUnreadNotificationCountOutput,
} from "../dtos/notification.dto";

export interface IGetUnreadNotificationCountUseCase {
	execute(
		input: GetUnreadNotificationCountInput,
	): Promise<GetUnreadNotificationCountOutput>;
}
