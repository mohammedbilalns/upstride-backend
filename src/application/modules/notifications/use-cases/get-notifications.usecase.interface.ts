import type {
	GetNotificationsInput,
	GetNotificationsOutput,
} from "../dtos/notification.dto";

export interface IGetNotificationsUseCase {
	execute(input: GetNotificationsInput): Promise<GetNotificationsOutput>;
}
